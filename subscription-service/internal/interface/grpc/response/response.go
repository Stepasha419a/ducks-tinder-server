package grpc_response

import (
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/proto/gen"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type SubscriptionResponse struct {
	*mapper.SubscriptionResponse
}

func (r *SubscriptionResponse) ToSubscriptionGrpcResponse() *gen.Subscription {
	res := &gen.Subscription{
		UserId:       r.UserId,
		Subscription: r.Subscription,
		Login:        r.Login,

		SuperLikesCount:   int32(r.SuperLikesCount),
		SearchBoostsCount: int32(r.SearchBoostsCount),

		ExpiresAt: timestamppb.New(r.ExpiresAt),
		CreatedAt: timestamppb.New(r.CreatedAt),
	}

	if r.SearchBoostExpiresAt != nil {
		res.SearchBoostExpiresAt = timestamppb.New(*r.SearchBoostExpiresAt)
	}

	return res
}
