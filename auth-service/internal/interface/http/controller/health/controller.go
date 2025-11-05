package health_controller

import (
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
	e.GET("/readyz", controller.SuccessHealth)
	e.GET("/startupz", controller.SuccessHealth)

	return controller
}

func (ac *HealthController) SuccessHealth(c *gin.Context) {
	c.Status(http.StatusOK)
}
