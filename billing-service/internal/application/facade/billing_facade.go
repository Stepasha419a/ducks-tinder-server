package facade

import (
	"billing-service/internal/application/mapper"
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"
	"billing-service/internal/application/service"
	"billing-service/internal/domain/repository"
	"context"
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

func (f *BillingFacade) GetUserCreditCard(ctx context.Context, query *get_user_credit_card.GetUserCreditCardQuery) (*mapper.CreditCardResponse, error) {
	return get_user_credit_card.GetUserCreditCardQueryHandler(ctx, query, f.creditCardRepository)
}
