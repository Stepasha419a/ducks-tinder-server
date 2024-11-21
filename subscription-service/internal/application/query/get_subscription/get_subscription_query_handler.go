package get_subscription

import (
	"net/http"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	service_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service/context"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/repository"
)

func GetSubscriptionQueryHandler(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], query *GetSubscriptionQuery, subscriptionRepository repository.SubscriptionRepository) error {
	subscription, err := subscriptionRepository.Find(ctx.Context(), query.UserId, nil)
	if err != nil {
		return err
	}

	if subscription == nil {
		return ctx.NotFound()
	}

	return ctx.Response(http.StatusOK, mapper.NewSubscriptionResponse(subscription))
}
