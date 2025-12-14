package health_controller

import (
	connection_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/connection"
)

type HealthController struct {
	connectionService *connection_service.ConnectionService
}
