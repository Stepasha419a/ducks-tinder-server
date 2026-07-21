package facade

import (
	"billing-service/internal/application/command/handle_user_purchase"
	"billing-service/internal/application/mapper"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/repository"
)

type BillingFacade struct {
	billingRepository repository.BillingRepository
}

func NewBillingFacade(billingRepository repository.BillingRepository) *BillingFacade {
	return &BillingFacade{billingRepository}
}

func (f *BillingFacade) HandleUserPurchase(ctx service_context.ServiceContext[*mapper.PurchaseResponse], command *handle_user_purchase.HandleUserPurchaseCommand) error {
	return handle_user_purchase.HandleUserPurchaseCommandHandler(ctx, command, f.billingRepository)
}
