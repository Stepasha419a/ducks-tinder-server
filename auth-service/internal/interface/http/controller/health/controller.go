package health_controller

import (
	connection_service "auth-service/internal/domain/service/connection"
	"net/http"

	"github.com/gin-gonic/gin"
)

type (
	HealthController struct {
		ConnectionService *connection_service.ConnectionService
	}
)

func NewHealthController(e *gin.Engine, connectionService *connection_service.ConnectionService) *HealthController {
	controller := &HealthController{
		ConnectionService: connectionService,
	}

	e.GET("/livez", controller.SuccessHealth)
	e.GET("/readyz", controller.ReadyHealth)
	e.GET("/startupz", controller.SuccessHealth)

	return controller
}

func (hc *HealthController) ReadyHealth(c *gin.Context) {
	report := hc.ConnectionService.GetConnectionStateReport()

	isHealthy := report.Status == connection_service.StateUp
	if isHealthy {
		c.JSON(http.StatusOK, report)

		return
	}

	c.JSON(http.StatusServiceUnavailable, report)
}

func (hc *HealthController) SuccessHealth(c *gin.Context) {
	c.Status(http.StatusOK)
}
