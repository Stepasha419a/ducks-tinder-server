package service

import (
	"billing-service/internal/application/command/handle_user_purchase"
	"billing-service/internal/application/mapper"
	service_context "billing-service/internal/application/service/context"
)

type (
	BillingService interface {
		HandleUserPurchase(ctx service_context.ServiceContext[*mapper.PurchaseResponse], command *handle_user_purchase.HandleUserPurchaseCommand) error
	}
)
