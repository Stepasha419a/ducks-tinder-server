package grpc_subscription_service_server_impl

import (
	"context"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service"
	validator_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/validator"
	interface_common "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/common"
	grpc_context_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc/context"
	grpc_response "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc/response"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/proto/gen"
)

type SubscriptionServiceServerImpl struct {
	gen.UnimplementedSubscriptionServiceServer
	subscriptionService service.SubscriptionService
	validatorService    validator_service.ValidatorService
}

func NewSubscriptionServiceServerImpl(subscriptionService service.SubscriptionService, validatorService validator_service.ValidatorService) *SubscriptionServiceServerImpl {
	return &SubscriptionServiceServerImpl{subscriptionService: subscriptionService, validatorService: validatorService}
}

func (s *SubscriptionServiceServerImpl) GetSubscription(ctx context.Context, req *gen.GetSubscriptionRequest) (*gen.Subscription, error) {
	dto := interface_common.GetSubscriptionDto{UserId: req.UserId}

	query, err := dto.ToGetSubscriptionQuery(s.validatorService)
	if err != nil {
		return nil, err
	}

	serviceContext := grpc_context_impl.NewServiceContext[*mapper.SubscriptionResponse](ctx)
	err = s.subscriptionService.GetSubscription(serviceContext, query)

	if err != nil {
		return nil, err
	}
	if serviceContext.ResponseData == nil || serviceContext.ResponseStatus == 0 {
		return nil, serviceContext.InternalServerError()
	}

	response := &grpc_response.SubscriptionResponse{
		SubscriptionResponse: serviceContext.ResponseData,
	}

	return response.ToSubscriptionGrpcResponse(), nil
}
