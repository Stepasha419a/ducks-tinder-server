package grpc_interface

import (
	config_service "billing-service/internal/domain/service/config"
	"billing-service/proto/gen"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"
)

func NewGrpc(billingServer gen.BillingServiceServer) (*grpc.Server, func()) {
	server := grpc.NewServer( /* grpc.ChainUnaryInterceptor(RecoveryUnaryInterceptor, AuthUnaryInterceptor) */ )

	gen.RegisterBillingServiceServer(server, billingServer)

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
		con.Close()
	}()

	log.Printf("gRPC server is listening on port %d", PORT)
	if err := server.Serve(con); err != nil {
		return err
	}

	return nil
}
