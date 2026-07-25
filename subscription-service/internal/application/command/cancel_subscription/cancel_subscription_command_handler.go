package cancel_subscription

import (
	"net/http"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	service_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service/context"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/repository"
)

func CancelSubscriptionCommandHandler(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], command *CancelSubscriptionCommand, subscriptionRepository repository.SubscriptionRepository) error {
	subscription, err := subscriptionRepository.FindActive(ctx.Context(), command.UserId, nil)
	if err != nil {
		return err
	}

	if subscription == nil || subscription.CancelledAt != nil {
		return ctx.NotFound()
	}

	subscription.Cancel()

	updatedSubscription, err := subscriptionRepository.Save(ctx.Context(), subscription, nil)
	if err != nil {
		return err
	}

	return ctx.Response(http.StatusOK, mapper.NewSubscriptionResponse(updatedSubscription))
}
