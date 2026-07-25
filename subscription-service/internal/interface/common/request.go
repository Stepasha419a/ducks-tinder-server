package interface_common

import (
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/command/cancel_subscription"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/command/create_subscription"
	get_subscription "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/query/get_subscription"
	validator_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/validator"
)

type GetSubscriptionDto struct {
	UserId string `validate:"required,uuid4"`
}

func (dto *GetSubscriptionDto) ToGetSubscriptionQuery(validatorService validator_service.ValidatorService) (*get_subscription.GetSubscriptionQuery, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &get_subscription.GetSubscriptionQuery{
		UserId: dto.UserId,
	}, nil
}

type CreateSubscriptionDto struct {
	UserId       string `validate:"required,uuid4"`
	Subscription string `validate:"required"`
	Login        string `validate:"required,max=50"`
}

func (dto *CreateSubscriptionDto) ToCreateSubscriptionCommand(validatorService validator_service.ValidatorService) (*create_subscription.CreateSubscriptionCommand, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &create_subscription.CreateSubscriptionCommand{
		UserId:       dto.UserId,
		Subscription: dto.Subscription,
		Login:        dto.Login,
	}, nil
}

type CancelSubscriptionDto struct {
	UserId string `validate:"required,uuid4"`
}

func (dto *CancelSubscriptionDto) ToCancelSubscriptionCommand(validatorService validator_service.ValidatorService) (*cancel_subscription.CancelSubscriptionCommand, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &cancel_subscription.CancelSubscriptionCommand{
		UserId: dto.UserId,
	}, nil
}
