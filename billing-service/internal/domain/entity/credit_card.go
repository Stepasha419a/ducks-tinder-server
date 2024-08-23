package entity

import "time"

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
