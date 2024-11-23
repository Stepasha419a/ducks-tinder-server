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
