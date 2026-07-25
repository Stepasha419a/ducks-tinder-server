package mapper

import (
	"time"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/entity"
)

type SubscriptionResponse struct {
	UserId       string `json:"userId"`
	Subscription string `json:"subscription"`
	Login        string `json:"login"`

	SuperLikesCount   int `json:"superLikesCount"`
	SearchBoostsCount int `json:"searchBoostsCount"`

	SearchBoostExpiresAt *time.Time `json:"searchBoostExpiresAt"`

	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}

func NewSubscriptionResponse(subscription *entity.Subscription) *SubscriptionResponse {
	return &SubscriptionResponse{
		UserId:       subscription.UserId,
		Subscription: subscription.Subscription,
		Login:        subscription.Login,

		SuperLikesCount:   subscription.SuperLikesCount,
		SearchBoostsCount: subscription.SearchBoostsCount,

		SearchBoostExpiresAt: subscription.SearchBoostExpiresAt,

		ExpiresAt: subscription.ExpiresAt,
		CreatedAt: subscription.CreatedAt,
	}
}
