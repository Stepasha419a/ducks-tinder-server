package grpc_interface

import (
	config_service "billing-service/internal/domain/service/config"
	tls_service "billing-service/internal/infrastructure/service/tls"
	grpc_interceptor "billing-service/internal/interface/grpc/interceptor"
	"billing-service/proto/gen"
	"fmt"
	"log"
	"net"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"
)

var kaep = keepalive.EnforcementPolicy{
	MinTime:             5 * time.Second,
	PermitWithoutStream: true,
}

var kasp = keepalive.ServerParameters{
	MaxConnectionIdle:     10 * time.Minute,
	MaxConnectionAge:      30 * time.Minute,
	MaxConnectionAgeGrace: 15 * time.Second,
	Time:                  15 * time.Second,
	Timeout:               5 * time.Second,
}

func NewGrpc(configService config_service.ConfigService, billingServer gen.BillingServiceServer, interceptor *grpc_interceptor.GrpcInterceptor, tlsService *tls_service.TlsService) (*grpc.Server, func(), error) {
	tlsConfig := tlsService.GetConfig(configService.GetConfig().TlsServerName)
	creds := credentials.NewTLS(tlsConfig)

	opts := []grpc.ServerOption{
		grpc.ChainUnaryInterceptor(interceptor.RecoveryUnaryInterceptor, interceptor.AuthUnaryInterceptor),
		grpc.Creds(creds),

		grpc.KeepaliveEnforcementPolicy(kaep),
		grpc.KeepaliveParams(kasp),
	}

	server := grpc.NewServer(opts...)

	gen.RegisterBillingServiceServer(server, billingServer)

	return server, func() {
		log.Println("close grpc server")
		server.GracefulStop()
	}, nil
}

func InitGrpcListener(server *grpc.Server, configService config_service.ConfigService) error {
	PORT := configService.GetConfig().GrpcPort

	con, err := net.Listen("tcp", fmt.Sprintf(":%d", PORT))
	if err != nil {
		return err
	}

	defer func() {
		con.Close()
	}()

	log.Printf("gRPC server is listening on port %d", PORT)
	if err := server.Serve(con); err != nil {
		return err
	}

	return nil
}
