package service

import (
	"billing-service/internal/application/mapper"
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"
	service_context "billing-service/internal/application/service/context"
)

type (
	BillingService interface {
		GetUserCreditCard(ctx service_context.ServiceContext[*mapper.CreditCardResponse], query *get_user_credit_card.GetUserCreditCardQuery) error
	}
)
