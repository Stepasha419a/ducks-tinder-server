package grpc_service

import (
	"crypto/tls"
	"fmt"
	config_service "go-file-server/internal/service/config"
	"go-file-server/proto/gen"
	"log"
	"net"
	"path"
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
	MaxConnectionIdle:     5 * time.Minute,
	MaxConnectionAge:      time.Minute,
	MaxConnectionAgeGrace: 15 * time.Second,
	Time:                  15 * time.Second,
	Timeout:               1 * time.Second,
}

func Init() {
	// TODO: ssl
	certPath := path.Join("cert", config_service.GetConfig().Mode, "certificate.pem")
	privateKeyPath := path.Join("cert", config_service.GetConfig().Mode, "private-key.pem")

	cert, err := tls.LoadX509KeyPair(certPath, privateKeyPath)
	if err != nil {
		panic(err)
	}
	creds := credentials.NewServerTLSFromCert(&cert)

	opts := []grpc.ServerOption{
		grpc.ChainUnaryInterceptor(RecoveryUnaryInterceptor, AuthUnaryInterceptor),
		grpc.Creds(creds),

		grpc.KeepaliveEnforcementPolicy(kaep),
		grpc.KeepaliveParams(kasp),
	}

	server := grpc.NewServer(opts...)

	fileServer := FileServiceServerImpl{}

	gen.RegisterFileServiceServer(server, &fileServer)

	PORT := config_service.GetConfig().GrpcPort

	con, err := net.Listen("tcp", fmt.Sprintf(":%d", PORT))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	defer func() {
		server.Stop()
		con.Close()
	}()

	log.Printf("gRPC server listening on port %d", PORT)
	if err := server.Serve(con); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
