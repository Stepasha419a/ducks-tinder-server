package health_controller

import (
	connection_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/connection"
)

type HealthController struct {
	connectionService *connection_service.ConnectionService
}

func NewHealthController(f *fiber.App, connectionService *connection_service.ConnectionService) *HealthController {
	controller := &HealthController{connectionService}

	f.Get("/livez", controller.GetProbe)
	f.Get("/readyz", controller.GetReadyProbe)
	f.Get("/startupz", controller.GetProbe)

	return controller
}
