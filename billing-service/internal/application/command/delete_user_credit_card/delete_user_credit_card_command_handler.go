package delete_user_credit_card

import (
	"billing-service/internal/application/mapper"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/repository"
	"net/http"
)

func DeleteUserCreditCardCommandHandler(ctx service_context.ServiceContext[*mapper.CreditCardResponse], command *DeleteUserCreditCardCommand, creditCardRepository repository.CreditCardRepository) error {
	creditCard, err := creditCardRepository.FindByUserId(ctx.Context(), command.UserId, nil)
	if err != nil {
		return err
	}
	if creditCard == nil || creditCard.Id != command.CreditCardId {
		return ctx.NotFound()
	}

	err = creditCardRepository.Delete(ctx.Context(), creditCard.Id, nil)
	if err != nil {
		return err
	}

	return ctx.Response(http.StatusOK, mapper.NewCreditCardResponse(creditCard))
}
