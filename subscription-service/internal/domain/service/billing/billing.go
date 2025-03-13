package billing_service

import (
	"context"
)

type (
	BillingService interface {
		WithdrawUserCreditCard(ctx context.Context, request *WithdrawUserCreditCardRequest) (*Purchase, error)
	}

	WithdrawUserCreditCardRequest struct {
		UserId       string
		CreditCardId string
		Amount       int64
	}

	Purchase struct {
		Id           string
		UserId       string
		CreditCardId string
		Amount       int64
		CreatedAt    int64
	}
)
