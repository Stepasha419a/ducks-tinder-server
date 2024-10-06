package interface_common

import (
	"billing-service/internal/application/command/add_user_credit_card"
	"billing-service/internal/application/command/delete_user_credit_card"
	"billing-service/internal/application/command/withdraw_user_credit_card"
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

type AddUserCreditCardDto struct {
	UserId    string `validate:"required,uuid4"`
	Pan       string `validate:"credit_card"`
	Holder    string `validate:"credit_card_holder"`
	Cvc       string `validate:"credit_card_cvc"`
	ExpiresAt string `validate:"credit_card_expires_date_month"`
}

func (dto *AddUserCreditCardDto) ToAddUserCreditCardCommand(validatorService validator_service.ValidatorService) (*add_user_credit_card.AddUserCreditCardCommand, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &add_user_credit_card.AddUserCreditCardCommand{
		UserId:    dto.UserId,
		Pan:       dto.Pan,
		Holder:    dto.Holder,
		Cvc:       dto.Cvc,
		ExpiresAt: dto.ExpiresAt,
	}, nil
}

type DeleteUserCreditCardDto struct {
	UserId       string `validate:"required,uuid4"`
	CreditCardId string `validate:"required,uuid4"`
}

func (dto *DeleteUserCreditCardDto) ToDeleteUserCreditCardCommand(validatorService validator_service.ValidatorService) (*delete_user_credit_card.DeleteUserCreditCardCommand, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &delete_user_credit_card.DeleteUserCreditCardCommand{
		UserId:       dto.UserId,
		CreditCardId: dto.CreditCardId,
	}, nil
}

type WithdrawUserCreditCardDto struct {
	UserId       string `validate:"required,uuid4"`
	CreditCardId string `validate:"required,uuid4"`
	Amount       int64  `validate:"required,number,min=1"`
}

func (dto *WithdrawUserCreditCardDto) ToWithdrawUserCreditCardCommand(validatorService validator_service.ValidatorService) (*withdraw_user_credit_card.WithdrawUserCreditCardCommand, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &withdraw_user_credit_card.WithdrawUserCreditCardCommand{
		UserId:       dto.UserId,
		CreditCardId: dto.CreditCardId,
		Amount:       dto.Amount,
	}, nil
}
