package service

import (
	"billing-service/internal/application/mapper"
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"
	"context"
)

type (
	BillingService interface {
		GetUserCreditCard(ctx context.Context, query *get_user_credit_card.GetUserCreditCardQuery) (*mapper.CreditCardResponse, error)
	}
)
