package billing_service_impl

import (
	"context"
	"log"
	"path"
	"time"

	billing_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/billing"
	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	jwt_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/jwt"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/proto/gen"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"
)

type BillingServiceImpl struct {
	client gen.BillingServiceClient
	conn   *grpc.ClientConn
}

func NewBillingServiceImpl(configService config_service.ConfigService, jwtService *jwt_service.JwtService) (*BillingServiceImpl, func(), error) {
	perRPC := NewPerRPCCredentialsImpl(jwtService)
	opts := []grpc.DialOption{
		grpc.WithPerRPCCredentials(perRPC),
	}

	log.Printf("gRPC billing service client is connected to %s", configService.GetConfig().GrpcBillingServiceUrl)
	conn, err := grpc.NewClient(configService.GetConfig().GrpcBillingServiceUrl, opts...)
	if err != nil {
		return nil, nil, err
	}

	service := &BillingServiceImpl{
		client: gen.NewBillingServiceClient(conn),
		conn:   conn,
	}

	return service, func() {
		log.Println("close grpc billing service client")

		if service.conn != nil {
			service.conn.Close()
		}
	}, nil
}
