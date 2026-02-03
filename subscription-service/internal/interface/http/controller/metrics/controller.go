package metrics_controller

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/adaptor"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type MetricsController struct{}

func NewMetricsController(app *fiber.App) *MetricsController {
	controller := &MetricsController{}

	metricsHandler := promhttp.Handler()

	app.Get("/metrics", adaptor.HTTPHandler(metricsHandler))

	return controller
}
