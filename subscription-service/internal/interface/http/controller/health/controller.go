package health_controller

import (
	"net/http"

	connection_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/connection"
	"github.com/gofiber/fiber/v3"
)

type HealthController struct {
	connectionService *connection_service.ConnectionService
}

func NewHealthController(app *fiber.App, connectionService *connection_service.ConnectionService) *HealthController {
	controller := &HealthController{connectionService}

	app.Get("/livez", controller.GetProbe)
	app.Get("/readyz", controller.GetReadyProbe)
	app.Get("/startupz", controller.GetProbe)

	return controller
}

func (hc *HealthController) GetReadyProbe(ctx fiber.Ctx) error {
	report := hc.connectionService.GetConnectionStateReport()
	if report.Status == connection_service.StateDown {
		return ctx.Status(http.StatusServiceUnavailable).JSON(report)
	}

	return ctx.JSON(report)
}

func (hc *HealthController) GetProbe(ctx fiber.Ctx) error {
	return ctx.Status(http.StatusOK).End()
}
