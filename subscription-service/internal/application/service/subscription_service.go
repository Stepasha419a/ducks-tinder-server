package service

import (
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/command/create_subscription"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/command/delete_subscription"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	get_subscription "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/query/get_subscription"
	service_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service/context"
)

type (
	SubscriptionService interface {
		GetSubscription(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], query *get_subscription.GetSubscriptionQuery) error
		CreateSubscription(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], query *create_subscription.CreateSubscriptionCommand) error
		DeleteSubscription(ctx service_context.ServiceContext[*mapper.SubscriptionResponse], query *delete_subscription.DeleteSubscriptionCommand) error
	}
)
