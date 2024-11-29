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

	return controller
}
