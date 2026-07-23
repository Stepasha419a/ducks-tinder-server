package billing_service

import (
	"context"
)

type (
	BillingService interface {
		HandleUserPurchase(ctx context.Context, request *HandleUserPurchaseRequest) (*Purchase, error)
	}

	HandleUserPurchaseRequest struct {
		UserId string
		Amount int64
	}

	Purchase struct {
		Id        string
		UserId    string
		Amount    int64
		CreatedAt int64
	}
)
