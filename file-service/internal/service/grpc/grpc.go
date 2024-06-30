package grpc_service

import (
	"fmt"
	config_service "go-file-server/internal/service/config"
	"go-file-server/proto/gen"
	"log"
	"net"

	"google.golang.org/grpc"
)

func Init() {
	server := grpc.NewServer(grpc.ChainUnaryInterceptor(RecoveryUnaryInterceptor, AuthUnaryInterceptor))

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
