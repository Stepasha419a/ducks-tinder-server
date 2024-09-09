package billing_controller

import (
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"

	"github.com/go-playground/validator/v10"
)

type GetUserCreditCardDto struct {
	UserId string `validate:"required,uuid4"`
}

func (dto *GetUserCreditCardDto) ToGetUserCreditCardQuery(validate *validator.Validate) (*get_user_credit_card.GetUserCreditCardQuery, error) {
	err := validate.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &get_user_credit_card.GetUserCreditCardQuery{
		UserId: dto.UserId,
	}, nil
}
