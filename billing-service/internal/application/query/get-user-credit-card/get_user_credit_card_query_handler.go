package get_user_credit_card

import (
	"billing-service/internal/application/mapper"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/repository"
	"net/http"
)

func GetUserCreditCardQueryHandler(ctx service_context.ServiceContext[*mapper.CreditCardResponse], query *GetUserCreditCardQuery, creditCardRepository repository.CreditCardRepository) error {
	creditCard, err := creditCardRepository.FindByUserId(ctx.Context(), query.UserId, nil)
	if err != nil {
		return err
	}

	if creditCard == nil {
		return ctx.NotFound()
	}

	return ctx.Response(http.StatusOK, mapper.NewCreditCardResponse(creditCard))
}
