package fiber_impl

import (
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service"
	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	connection_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/connection"
	validator_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/validator"
	health_controller "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/controller/health"
	metrics_controller "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/controller/metrics"
	subscription_controller "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/controller/subscription"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/middleware"
)

type HttpFiberApp struct {
	Fiber *FiberImpl
}

func NewHttpFiberApp(middleware *middleware.Middleware, service service.SubscriptionService, configService config_service.ConfigService, validatorService validator_service.ValidatorService) (*HttpFiberApp, func()) {
	port := int(configService.GetConfig().Port)
	httpApp, cleaner := NewFiberApp(port, "http", configService)

	httpApp.App.Use(middleware.AuthMiddleware)

	subscription_controller.NewSubscriptionController(httpApp.App, service, validatorService)

	return &HttpFiberApp{Fiber: httpApp}, cleaner
}

type HealthFiberApp struct {
	Fiber *FiberImpl
}

func NewHealthFiberApp(configService config_service.ConfigService, connectionService *connection_service.ConnectionService) (*HealthFiberApp, func()) {
	port := int(configService.GetConfig().HealthPort)
	healthApp, cleaner := NewFiberApp(port, "health", configService)

	health_controller.NewHealthController(healthApp.App, connectionService)
	metrics_controller.NewMetricsController(healthApp.App)

	return &HealthFiberApp{Fiber: healthApp}, cleaner
}
