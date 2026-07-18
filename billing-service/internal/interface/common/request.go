package interface_common

import (
	"billing-service/internal/application/command/handle_user_purchase"
	validator_service "billing-service/internal/domain/service/validator"
)

type HandleUserPurchaseDto struct {
	UserId string `validate:"required,uuid4"`
	Amount int64  `validate:"required,number,min=1"`
}

func (dto *HandleUserPurchaseDto) ToHandleUserPurchaseCommand(validatorService validator_service.ValidatorService) (*handle_user_purchase.HandleUserPurchaseCommand, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &handle_user_purchase.HandleUserPurchaseCommand{
		UserId: dto.UserId,
		Amount: dto.Amount,
	}, nil
}
