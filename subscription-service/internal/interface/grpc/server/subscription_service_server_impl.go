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
