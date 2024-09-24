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
