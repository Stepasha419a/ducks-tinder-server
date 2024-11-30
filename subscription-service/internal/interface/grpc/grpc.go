package grpc_interface

import (
	"fmt"
	"log"
	"net"
	"time"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
	grpc_interceptor "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc/interceptor"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/proto/gen"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"
)

var kaep = keepalive.EnforcementPolicy{
	MinTime:             5 * time.Second,
	PermitWithoutStream: true,
}

var kasp = keepalive.ServerParameters{
	MaxConnectionIdle:     5 * time.Minute,
	MaxConnectionAge:      time.Minute,
	MaxConnectionAgeGrace: 15 * time.Second,
	Time:                  15 * time.Second,
	Timeout:               1 * time.Second,
}

func NewGrpc(billingServer gen.SubscriptionServiceServer, interceptor *grpc_interceptor.GrpcInterceptor, tlsService *tls_service.TlsService) (*grpc.Server, func()) {
	tlsConfig := tlsService.GetConfig()
	creds := credentials.NewTLS(tlsConfig)

	opts := []grpc.ServerOption{
		grpc.ChainUnaryInterceptor(interceptor.RecoveryUnaryInterceptor, interceptor.AuthUnaryInterceptor),
		grpc.Creds(creds),

		grpc.KeepaliveEnforcementPolicy(kaep),
		grpc.KeepaliveParams(kasp),
	}

	server := grpc.NewServer(opts...)

	gen.RegisterSubscriptionServiceServer(server, billingServer)

	return server, func() {
		log.Println("close grpc server")
		server.GracefulStop()
	}
}

func InitGrpcListener(server *grpc.Server, configService config_service.ConfigService) error {
	PORT := configService.GetConfig().GrpcPort

	con, err := net.Listen("tcp", fmt.Sprintf(":%d", PORT))
	if err != nil {
		return err
	}

	defer func() {
		server.Stop()
		con.Close()
	}()

	log.Printf("gRPC server is listening on port %d", PORT)
	if err := server.Serve(con); err != nil {
		return err
	}

	return nil
}
