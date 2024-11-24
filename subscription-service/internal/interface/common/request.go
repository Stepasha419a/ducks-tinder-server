package interface_common

import (
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/command/create_subscription"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/command/delete_subscription"
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
	CreditCardId string `validate:"required,uuid4"`
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
		CreditCardId: dto.CreditCardId,
		Subscription: dto.Subscription,
		Login:        dto.Login,
	}, nil
}
