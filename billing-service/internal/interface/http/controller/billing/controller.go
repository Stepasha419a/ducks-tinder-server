package billing_controller

import (
	"billing-service/internal/application/service"
	validator_service "billing-service/internal/domain/service/validator"
	fiber_impl "billing-service/internal/interface/http/fiber"
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

	return controller
}

func (bc *BillingController) GetUserCreditCard(ctx fiber.Ctx) error {
	rawUserId := ctx.Locals("userId")

	userId, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Undefined userId")
	}

	dto := GetUserCreditCardDto{UserId: userId}

	query, err := dto.ToGetUserCreditCardQuery(bc.validatorService)
	if err != nil {
		return fiber.NewError(http.StatusBadRequest, "Validation failed: "+err.Error())
	}

	serviceContext := fiber_impl.NewServiceContext(ctx)
	return bc.service.GetUserCreditCard(serviceContext, query)
}
