package facade

import (
	"billing-service/internal/application/mapper"
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/repository"
)

type BillingFacade struct {
	creditCardRepository repository.CreditCardRepository
}

var (
	_ service.BillingService = (*BillingFacade)(nil)
)

func NewBillingFacade(creditCardRepository repository.CreditCardRepository) *BillingFacade {
	return &BillingFacade{creditCardRepository}
}

func (f *BillingFacade) GetUserCreditCard(ctx service_context.ServiceContext[*mapper.CreditCardResponse], query *get_user_credit_card.GetUserCreditCardQuery) error {
	return get_user_credit_card.GetUserCreditCardQueryHandler(ctx, query, f.creditCardRepository)
}
