package grpc_response

import (
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/proto/gen"
)

type SubscriptionResponse struct {
	*mapper.SubscriptionResponse
}

func (r *SubscriptionResponse) ToSubscriptionGrpcResponse() *gen.Subscription {
	expiresAt := r.ExpiresAt.Unix()
	createdAt := r.CreatedAt.Unix()

	return &gen.Subscription{
		UserId:       r.UserId,
		Subscription: r.Subscription,
		Login:        r.Login,
		ExpiresAt:    expiresAt,
		CreatedAt:    createdAt,
	}
}
