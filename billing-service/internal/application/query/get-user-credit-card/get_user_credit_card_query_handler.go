package get_user_credit_card

import (
	response_service "billing-service/internal/application/common/response"
	"billing-service/internal/application/mapper"
	service_context "billing-service/internal/application/service/context"
	"billing-service/internal/domain/repository"
	"net/http"
)

func GetUserCreditCardQueryHandler(ctx service_context.ServiceContext, query *GetUserCreditCardQuery, creditCardRepository repository.CreditCardRepository) error {
	creditCard, err := creditCardRepository.FindByUserId(ctx.Context(), query.UserId, nil)
	if err != nil {
		return err
	}

	if creditCard == nil {
		responseError(http.StatusNotFound, "Not found")
		return nil, nil
	}

	return mapper.NewCreditCardResponse(creditCard), nil
}
