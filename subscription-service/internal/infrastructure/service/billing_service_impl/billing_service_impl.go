package billing_service_impl

import (
	"context"
	"crypto/tls"
	"log"
	"time"

	billing_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/billing"
	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	jwt_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/jwt"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/proto/gen"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"
)

type BillingServiceImpl struct {
	client gen.BillingServiceClient
	conn   *grpc.ClientConn
}

var kacp = keepalive.ClientParameters{
	Time:                10 * time.Second,
	Timeout:             time.Second,
	PermitWithoutStream: true,
}

func NewBillingServiceImpl(configService config_service.ConfigService, jwtService *jwt_service.JwtService, tlsService *tls_service.TlsService) (*BillingServiceImpl, func(), error) {
	tlsConfig := tlsService.GetConfig()

	tlsConfig.ClientAuth = tls.RequireAndVerifyClientCert
	creds := credentials.NewTLS(tlsConfig)

	perRPC := NewPerRPCCredentialsImpl(jwtService)
	opts := []grpc.DialOption{
		grpc.WithPerRPCCredentials(perRPC),
		grpc.WithTransportCredentials(creds),

		grpc.WithKeepaliveParams(kacp),
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

func (c *BillingServiceImpl) WithdrawUserCreditCard(ctx context.Context, request *billing_service.WithdrawUserCreditCardRequest) (*billing_service.Purchase, error) {
	in := &gen.WithdrawUserCreditCardRequest{
		UserId:       request.UserId,
		CreditCardId: request.CreditCardId,
		Amount:       request.Amount,
	}

	out, err := c.client.WithdrawUserCreditCard(ctx, in)
	if err != nil {
		return nil, err
	}

	response := &billing_service.Purchase{
		Id:           out.Id,
		CreditCardId: out.CreditCardId,
		Amount:       out.Amount,
		CreatedAt:    out.CreatedAt,
	}

	return response, nil
}
