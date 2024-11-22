package delete_subscription

import (
	"net/http"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	service_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service/context"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/repository"
)

func DeleteSubscriptionCommandHandler(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], command *DeleteSubscriptionCommand, subscriptionRepository repository.SubscriptionRepository) error {
	subscription, err := subscriptionRepository.Find(ctx.Context(), command.UserId, nil)
	if err != nil {
		return err
	}

	if subscription == nil {
		return ctx.NotFound()
	}

	err = subscriptionRepository.Delete(ctx.Context(), command.UserId, nil)
	if err != nil {
		return err
	}

	return ctx.Response(http.StatusOK, mapper.NewSubscriptionResponse(subscription))
}
