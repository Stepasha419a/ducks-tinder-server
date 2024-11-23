package facade

import (
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/command/create_subscription"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/command/delete_subscription"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	get_subscription "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/query/get_subscription"
	service_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service/context"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/repository"
	billing_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/billing"
	login_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/login"
)

type SubscriptionFacade struct {
	subscriptionRepository repository.SubscriptionRepository
	loginService           login_service.LoginService
	billingService         billing_service.BillingService
}

func NewSubscriptionFacade(subscriptionRepository repository.SubscriptionRepository, loginService login_service.LoginService, billingService billing_service.BillingService) *SubscriptionFacade {
	return &SubscriptionFacade{subscriptionRepository, loginService, billingService}
}

func (f *SubscriptionFacade) GetSubscription(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], query *get_subscription.GetSubscriptionQuery) error {
	return get_subscription.GetSubscriptionQueryHandler(ctx, query, f.subscriptionRepository)
}

func (f *SubscriptionFacade) CreateSubscription(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], command *create_subscription.CreateSubscriptionCommand) error {
	return create_subscription.CreateSubscriptionCommandHandler(ctx, command, f.subscriptionRepository, f.billingService, f.loginService)
}

func (f *SubscriptionFacade) DeleteSubscription(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], command *delete_subscription.DeleteSubscriptionCommand) error {
	return delete_subscription.DeleteSubscriptionCommandHandler(ctx, command, f.subscriptionRepository)
}
