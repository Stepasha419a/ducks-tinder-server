package health_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type (
	HealthController struct{}
)

func NewHealthController(e *gin.Engine) *HealthController {
	controller := &HealthController{}

	e.GET("/livez", controller.SuccessHealth)
	e.GET("/readyz", controller.SuccessHealth)
	e.GET("/startupz", controller.SuccessHealth)

	return controller
}

func (ac *HealthController) SuccessHealth(c *gin.Context) {
	c.Status(http.StatusOK)
}
