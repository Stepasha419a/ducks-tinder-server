package service

import (
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"
	service_context "billing-service/internal/application/service/context"
)

type (
	BillingService interface {
		GetUserCreditCard(ctx service_context.ServiceContext, query *get_user_credit_card.GetUserCreditCardQuery) error
	}
)
