package service

import (
	"billing-service/internal/application/command/add_user_credit_card"
	"billing-service/internal/application/command/delete_user_credit_card"
	"billing-service/internal/application/command/withdraw_user_credit_card"
	"billing-service/internal/application/mapper"
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"
	service_context "billing-service/internal/application/service/context"
)

type (
	BillingService interface {
		GetUserCreditCard(ctx service_context.ServiceContext[*mapper.CreditCardResponse], query *get_user_credit_card.GetUserCreditCardQuery) error
		AddUserCreditCard(ctx service_context.ServiceContext[*mapper.CreditCardResponse], command *add_user_credit_card.AddUserCreditCardCommand) error
		WithdrawUserCreditCard(ctx service_context.ServiceContext[*mapper.PurchaseResponse], command *withdraw_user_credit_card.WithdrawUserCreditCardCommand) error
		DeleteUserCreditCard(ctx service_context.ServiceContext[*mapper.CreditCardResponse], command *delete_user_credit_card.DeleteUserCreditCardCommand) error
	}
)
