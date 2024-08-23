package entity

import "time"

type Purchase struct {
	Id           string
	CreditCardId string
	Amount       int64

	CreatedAt time.Time
}
