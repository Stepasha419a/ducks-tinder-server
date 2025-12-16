package billing_service_impl

import (
	"context"

	billing_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/billing"
	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	connection_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/connection"
	grpc_client_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/grpc_client"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/proto/gen"
)

var connectionServiceName = "grpc_billing_service"
var displayName = "billing service"

type BillingServiceImpl struct {
	client  gen.BillingServiceClient
	service *grpc_client_service.GrpcClientService
}

func NewBillingServiceImpl(ctx context.Context, configService config_service.ConfigService, tlsService *tls_service.TlsService, connectionService *connection_service.ConnectionService) (*BillingServiceImpl, func()) {
	targetUrl := configService.GetConfig().GrpcBillingServiceUrl
	tlsServerName := configService.GetConfig().GrpcBillingServiceDomain

	clientService, cleanUp := grpc_client_service.NewGrpcClientService(ctx, tlsService, connectionService, &grpc_client_service.GrpcClientServiceOptions{TargetUrl: targetUrl, TlsServerName: tlsServerName, DisplayName: displayName, ConnectionStateName: connectionServiceName})
	service := &BillingServiceImpl{
		service: clientService,
	}

	service.client = gen.NewBillingServiceClient(service.service.Conn)

	return service, cleanUp
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
		UserId:       out.UserId,
		CreditCardId: out.CreditCardId,
		Amount:       out.Amount,
		CreatedAt:    out.CreatedAt,
	}

	return response, nil
}
