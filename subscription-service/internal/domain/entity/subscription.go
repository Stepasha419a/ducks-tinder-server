package entity

import (
	"time"
)

type Subscription struct {
	UserId       string
	Subscription string
	Login        string

	SuperLikesCount   int
	SearchBoostsCount int

	CancelledAt          *time.Time
	SearchBoostExpiresAt *time.Time

	ExpiresAt time.Time
	CreatedAt time.Time
}

func NewSubscription(userId string, subscription string, login string) *Subscription {
	return &Subscription{
		UserId:       userId,
		Subscription: subscription,
		Login:        login,

		ExpiresAt: time.Now().Add(time.Hour * 24 * 31),
		CreatedAt: time.Now(),
	}
}

func (s *Subscription) Cancel() {
	now := time.Now()
	s.CancelledAt = &now
}
