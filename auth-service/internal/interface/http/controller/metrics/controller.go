package metrics_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type (
	MetricsController struct{}
)

func NewMetricsController(e *gin.Engine) *MetricsController {
	controller := &MetricsController{}

	e.GET("/metrics", controller.GetMetricsHandler())

	return controller
}

func (mc *MetricsController) GetMetricsHandler() gin.HandlerFunc {
	h := promhttp.Handler()

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}
