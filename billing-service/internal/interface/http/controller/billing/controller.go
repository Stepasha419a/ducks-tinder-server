package billing_controller

import (
	"billing-service/internal/application/service"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type BillingController struct {
	service service.BillingService
}

func NewBillingController(f *fiber.App, service service.BillingService) *BillingController {
	controller := &BillingController{
		service,
	}

	f.Get("/billing/card", controller.GetUserCreditCard)

	return controller
}

var validate = validator.New()

func (bc *BillingController) GetUserCreditCard(c fiber.Ctx) error {
	rawUserId := c.Locals("userId")

	userId, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Internal server error")
	}

	dto := GetUserCreditCardDto{UserId: userId}

	query, err := dto.ToGetUserCreditCardQuery(validate)
	if err != nil {
		return fiber.NewError(http.StatusBadRequest, "Validation failed: "+err.Error())
	}

	res, err := bc.service.GetUserCreditCard(c.Context(), query)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(res)
}
