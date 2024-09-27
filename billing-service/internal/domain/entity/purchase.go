package entity

import (
	"time"

	"github.com/google/uuid"
)

type Purchase struct {
	Id           string
	CreditCardId string
	Amount       int64

	CreatedAt time.Time
}

func NewPurchase(creditCardId string, amount int64) (*Purchase, error) {
	return &Purchase{
		Id:           uuid.New().String(),
		CreditCardId: creditCardId,
		Amount:       amount,

		CreatedAt: time.Now(),
	}, nil
}
