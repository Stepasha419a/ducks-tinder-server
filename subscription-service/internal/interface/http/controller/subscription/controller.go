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

func NewSubscriptionController(app *fiber.App, service service.SubscriptionService, validatorService validator_service.ValidatorService) *SubscriptionController {
	controller := &SubscriptionController{
		service,
		validatorService,
	}

	app.Get("/subscription", controller.GetSubscription)
	app.Post("/subscription", controller.CreateSubscription)
	app.Delete("/subscription", controller.DeleteSubscription)

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

func (bc *SubscriptionController) CreateSubscription(ctx fiber.Ctx) error {
	rawUserId := ctx.Locals("userId")

	userId, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Undefined userId")
	}

	dto := new(interface_common.CreateSubscriptionDto)

	err := ctx.Bind().Body(dto)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber_impl_context.BadRequest)
	}

	serviceContext := fiber_impl_context.NewServiceContext[*mapper.SubscriptionResponse](ctx)

	dto.UserId = userId

	command, err := dto.ToCreateSubscriptionCommand(bc.validatorService)

	if err != nil {
		return serviceContext.ErrorMessage(http.StatusBadRequest, "Validation failed: "+err.Error())
	}

	return bc.service.CreateSubscription(serviceContext, command)
}

func (bc *SubscriptionController) DeleteSubscription(ctx fiber.Ctx) error {
	rawUserId := ctx.Locals("userId")

	userId, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Undefined userId")
	}

	dto := &interface_common.DeleteSubscriptionDto{
		UserId: userId,
	}

	serviceContext := fiber_impl_context.NewServiceContext[*mapper.SubscriptionResponse](ctx)
	command, err := dto.ToDeleteSubscriptionCommand(bc.validatorService)

	if err != nil {
		return serviceContext.ErrorMessage(http.StatusBadRequest, "Validation failed: "+err.Error())
	}

	return bc.service.DeleteSubscription(serviceContext, command)
}
