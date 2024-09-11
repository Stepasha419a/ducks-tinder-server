package entity

import (
	time_service "billing-service/internal/domain/service/time"
	"time"

	"github.com/google/uuid"
)

type CreditCard struct {
	Id        string
	UserId    string
	Pan       string
	Holder    string
	Cvc       string
	ExpiresAt time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewCreditCard(userId string, pan string, holder string, cvc string, expiresAt string) (*CreditCard, error) {
	expiresAtTime, err := time_service.ParseISOString(expiresAt)
	if err != nil {
		return nil, err
	}

	return &CreditCard{
		Id:        uuid.New().String(),
		UserId:    userId,
		Pan:       pan,
		Holder:    holder,
		Cvc:       cvc,
		ExpiresAt: expiresAtTime,

		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}
