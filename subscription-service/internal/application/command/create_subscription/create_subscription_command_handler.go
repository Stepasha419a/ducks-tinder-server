package create_subscription

import (
	"net/http"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	service_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service/context"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/entity"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/repository"
	billing_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/billing"
	login_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/login"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func CreateSubscriptionCommandHandler(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], command *CreateSubscriptionCommand, subscriptionRepository repository.SubscriptionRepository, billingService billing_service.BillingService, loginService login_service.LoginService) error {
	subscription, err := subscriptionRepository.FindByUserIdOrLogin(ctx.Context(), command.UserId, command.Login, nil)
	if err != nil {
		return err
	}

	if subscription != nil {
		if subscription.Login == command.Login {
			return ctx.ErrorMessage(http.StatusConflict, "Login is already used")
		}

		return ctx.Conflict()
	}

	isValid, err := loginService.CheckLogin(command.Login)
	if err != nil {
		return err
	}
	if !isValid {
		return ctx.ErrorMessage(http.StatusBadRequest, "Login is not valid")
	}

	request := &billing_service.WithdrawUserCreditCardRequest{
		UserId:       command.UserId,
		CreditCardId: command.CreditCardId,
		Amount:       10000,
	}
	purchase, err := billingService.WithdrawUserCreditCard(ctx.Context(), request)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return ctx.NotFound()
		}

		return err
	}
	if purchase == nil {
		return ctx.InternalServerError()
	}

	newSubscription := entity.NewSubscription(command.UserId, command.Subscription, command.Login)

	_, err = subscriptionRepository.Save(ctx.Context(), newSubscription, nil)
	if err != nil {
		return err
	}

	return ctx.Response(http.StatusOK, mapper.NewSubscriptionResponse(newSubscription))
}
