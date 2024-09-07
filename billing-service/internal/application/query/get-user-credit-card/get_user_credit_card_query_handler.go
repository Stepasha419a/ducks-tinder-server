package get_user_credit_card

import (
	"billing-service/internal/application/mapper"
	"billing-service/internal/domain/repository"
	"context"
	"net/http"
)

func GetUserCreditCardQueryHandler(ctx context.Context, query *GetUserCreditCardQuery, responseError func(status int, message string), creditCardRepository repository.CreditCardRepository) (*mapper.CreditCardResponse, error) {
	creditCard, err := creditCardRepository.FindByUserId(ctx, query.UserId, nil)
	if err != nil {
		return nil, err
	}

	if creditCard == nil {
		responseError(http.StatusNotFound, "Not found")
		return nil, nil
	}

	return mapper.NewCreditCardResponse(creditCard), nil
}
