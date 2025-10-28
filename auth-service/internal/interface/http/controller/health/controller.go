package health_controller

import (
	"github.com/gin-gonic/gin"
)

type (
	HealthController struct{}
)

func NewHealthController(e *gin.Engine) *HealthController {
	controller := &HealthController{}

	return controller
}
