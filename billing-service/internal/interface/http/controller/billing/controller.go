package billing_controller

import (
	"billing-service/internal/application/mapper"
	"billing-service/internal/application/service"
	validator_service "billing-service/internal/domain/service/validator"
	interface_common "billing-service/internal/interface/common"
	fiber_impl_context "billing-service/internal/interface/http/fiber/context"
	"net/http"

	"github.com/gofiber/fiber/v3"
)

type BillingController struct {
	service          service.BillingService
	validatorService validator_service.ValidatorService
}

func NewBillingController(f *fiber.App, service service.BillingService, validatorService validator_service.ValidatorService) *BillingController {
	controller := &BillingController{
		service,
		validatorService,
	}

	f.Get("/billing/card", controller.GetUserCreditCard)
	f.Post("/billing/card", controller.AddUserCreditCard)
	f.Delete("/billing/card/:id", controller.DeleteUserCreditCard)

	return controller
}

func (bc *BillingController) GetUserCreditCard(ctx fiber.Ctx) error {
	rawUserId := ctx.Locals("userId")

	userId, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Undefined userId")
	}

	dto := interface_common.GetUserCreditCardDto{UserId: userId}

	query, err := dto.ToGetUserCreditCardQuery(bc.validatorService)
	if err != nil {
		return fiber.NewError(http.StatusBadRequest, "Validation failed: "+err.Error())
	}

	serviceContext := fiber_impl_context.NewServiceContext[*mapper.CreditCardResponse](ctx)
	return bc.service.GetUserCreditCard(serviceContext, query)
}

func (bc *BillingController) AddUserCreditCard(ctx fiber.Ctx) error {
	rawUserId := ctx.Locals("userId")

	userId, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Undefined userId")
	}

	dto := new(interface_common.AddUserCreditCardDto)

	err := ctx.Bind().Body(dto)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber_impl_context.BadRequest)
	}

	dto.UserId = userId
	command, err := dto.ToAddUserCreditCardCommand(bc.validatorService)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber_impl_context.MapResponse(http.StatusBadRequest, "Validation failed: "+err.Error()))
	}

	serviceContext := fiber_impl_context.NewServiceContext[*mapper.CreditCardResponse](ctx)
	return bc.service.AddUserCreditCard(serviceContext, command)
}

func (bc *BillingController) DeleteUserCreditCard(ctx fiber.Ctx) error {
	rawUserId := ctx.Locals("userId")

	userId, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Undefined userId")
	}

	id := ctx.Params("id")

	dto := &interface_common.DeleteUserCreditCardDto{
		UserId:       userId,
		CreditCardId: id,
	}

	command, err := dto.ToDeleteUserCreditCardCommand(bc.validatorService)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber_impl_context.MapResponse(http.StatusBadRequest, "Validation failed: "+err.Error()))
	}

	serviceContext := fiber_impl_context.NewServiceContext[*mapper.CreditCardResponse](ctx)
	return bc.service.DeleteUserCreditCard(serviceContext, command)
}
