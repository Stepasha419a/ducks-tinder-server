package billing_controller

import (
	get_user_credit_card "billing-service/internal/application/query/get-user-credit-card"
	validator_service "billing-service/internal/domain/service/validator"
)

type GetUserCreditCardDto struct {
	UserId string `validate:"required,uuid4"`
}

func (dto *GetUserCreditCardDto) ToGetUserCreditCardQuery(validatorService validator_service.ValidatorService) (*get_user_credit_card.GetUserCreditCardQuery, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &get_user_credit_card.GetUserCreditCardQuery{
		UserId: dto.UserId,
	}, nil
}
