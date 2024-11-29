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
func NewGrpc(billingServer gen.SubscriptionServiceServer, interceptor *grpc_interceptor.GrpcInterceptor, tlsService *tls_service.TlsService) (*grpc.Server, func()) {
	opts := []grpc.ServerOption{
	}

	server := grpc.NewServer(opts...)

	gen.RegisterSubscriptionServiceServer(server, billingServer)

	return server, func() {
		log.Println("close grpc server")
		server.GracefulStop()
	}
}
