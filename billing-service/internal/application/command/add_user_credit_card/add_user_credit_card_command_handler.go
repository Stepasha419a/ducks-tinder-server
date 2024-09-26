package add_user_credit_card

import (
	"billing-service/internal/application/mapper"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/entity"
	"billing-service/internal/domain/repository"
	"net/http"
)

func AddUserCreditCardCommandHandler(ctx service_context.ServiceContext[*mapper.CreditCardResponse], command *AddUserCreditCardCommand, creditCardRepository repository.CreditCardRepository) error {
	creditCard, err := creditCardRepository.FindByUserId(ctx.Context(), command.UserId, nil)
	if err != nil {
		return err
	}

	if creditCard != nil {
		err = creditCardRepository.Delete(ctx.Context(), creditCard.Id, nil)
		if err != nil {
			return err
		}
	}

	newCreditCard, err := entity.NewCreditCard(command.UserId, command.Pan, command.Holder, command.Cvc, command.ExpiresAt)
	if err != nil {
		return err
	}

	_, err = creditCardRepository.Save(ctx.Context(), newCreditCard, nil)
	if err != nil {
		return err
	}

	return ctx.Response(http.StatusCreated, mapper.NewCreditCardResponse(newCreditCard))
}
