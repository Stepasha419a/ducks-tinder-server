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
