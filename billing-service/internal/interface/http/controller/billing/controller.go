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
