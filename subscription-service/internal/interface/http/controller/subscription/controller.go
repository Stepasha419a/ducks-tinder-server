package subscription_controller

import (
	"net/http"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/mapper"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service"
	validator_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/validator"
	interface_common "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/common"
	fiber_impl_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/fiber/context"

	"github.com/gofiber/fiber/v3"
)

type SubscriptionController struct {
	service          service.SubscriptionService
	validatorService validator_service.ValidatorService
}

func NewSubscriptionController(f *fiber.App, service service.SubscriptionService, validatorService validator_service.ValidatorService) *SubscriptionController {
	controller := &SubscriptionController{
		service,
		validatorService,
	}

	f.Get("/subscription", controller.GetSubscription)

	return controller
}

func (bc *SubscriptionController) GetSubscription(ctx fiber.Ctx) error {
	rawUserId := ctx.Locals("userId")

	userId, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Undefined userId")
	}

	dto := &interface_common.GetSubscriptionDto{
		UserId: userId,
	}

	query, err := dto.ToGetSubscriptionQuery(bc.validatorService)
	if err != nil {
		return fiber.NewError(http.StatusBadRequest, "Validation failed: "+err.Error())
	}

	serviceContext := fiber_impl_context.NewServiceContext[*mapper.SubscriptionResponse](ctx)
	return bc.service.GetSubscription(serviceContext, query)
}
