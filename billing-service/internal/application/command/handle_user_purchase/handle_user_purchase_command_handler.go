package handle_user_purchase

import (
	"billing-service/internal/application/mapper"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/entity"
	"billing-service/internal/domain/repository"
	"net/http"
)

func HandleUserPurchaseCommandHandler(ctx service_context.ServiceContext[*mapper.PurchaseResponse], command *HandleUserPurchaseCommand, billingRepository repository.BillingRepository) error {
	purchase, err := entity.NewPurchase(command.UserId, command.Amount)
	if err != nil {
		return err
	}

	_, err = billingRepository.SavePurchase(ctx.Context(), purchase, nil)
	if err != nil {
		return err
	}

	return ctx.Response(http.StatusCreated, mapper.NewPurchaseResponse(purchase))
}
