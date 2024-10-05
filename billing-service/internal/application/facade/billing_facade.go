package facade

import (
	"billing-service/internal/application/command/add_user_credit_card"
	"billing-service/internal/application/command/delete_user_credit_card"
	"billing-service/internal/application/command/withdraw_user_credit_card"
	"billing-service/internal/application/mapper"
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/repository"
)

type BillingFacade struct {
	creditCardRepository repository.CreditCardRepository
}

func NewBillingFacade(creditCardRepository repository.CreditCardRepository) *BillingFacade {
	return &BillingFacade{creditCardRepository}
}

func (f *BillingFacade) GetUserCreditCard(ctx service_context.ServiceContext[*mapper.CreditCardResponse], query *get_user_credit_card.GetUserCreditCardQuery) error {
	return get_user_credit_card.GetUserCreditCardQueryHandler(ctx, query, f.creditCardRepository)
}

func (f *BillingFacade) AddUserCreditCard(ctx service_context.ServiceContext[*mapper.CreditCardResponse], command *add_user_credit_card.AddUserCreditCardCommand) error {
	return add_user_credit_card.AddUserCreditCardCommandHandler(ctx, command, f.creditCardRepository)
}

func (f *BillingFacade) WithdrawUserCreditCard(ctx service_context.ServiceContext[*mapper.PurchaseResponse], command *withdraw_user_credit_card.WithdrawUserCreditCardCommand) error {
	return withdraw_user_credit_card.WithdrawUserCreditCardCommandHandler(ctx, command, f.creditCardRepository)
}

func (f *BillingFacade) DeleteUserCreditCard(ctx service_context.ServiceContext[*mapper.CreditCardResponse], command *delete_user_credit_card.DeleteUserCreditCardCommand) error {
	return delete_user_credit_card.DeleteUserCreditCardCommandHandler(ctx, command, f.creditCardRepository)
}
