package entity

import (
	"time"
)

type Subscription struct {
	UserId       string
	Subscription string
	Login        string

	ExpiresAt time.Time
	CreatedAt time.Time
}

