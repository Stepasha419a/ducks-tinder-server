package withdraw_user_credit_card

import (
	"billing-service/internal/application/mapper"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/entity"
	"billing-service/internal/domain/repository"
	"net/http"
)

func WithdrawUserCreditCardCommandHandler(ctx service_context.ServiceContext[*mapper.PurchaseResponse], command *WithdrawUserCreditCardCommand, creditCardRepository repository.CreditCardRepository) error {
	creditCard, err := creditCardRepository.FindByUserId(ctx.Context(), command.UserId, nil)
	if err != nil {
		return err
	}
	if creditCard == nil || creditCard.Id != command.CreditCardId {
		return ctx.NotFound()
	}

	purchase, err := entity.NewPurchase(command.CreditCardId, command.Amount)
	if err != nil {
		return err
	}

	_, err = creditCardRepository.SavePurchase(ctx.Context(), purchase, nil)
	if err != nil {
		return err
	}

	return ctx.Response(http.StatusCreated, mapper.NewPurchaseResponse(purchase))
}
