package fiber_impl

import (
	"billing-service/internal/application/service"
	config_service "billing-service/internal/domain/service/config"
	connection_service "billing-service/internal/domain/service/connection"
	validator_service "billing-service/internal/domain/service/validator"
	billing_controller "billing-service/internal/interface/http/controller/billing"
	health_controller "billing-service/internal/interface/http/controller/health"
	metrics_controller "billing-service/internal/interface/http/controller/metrics"
	"billing-service/internal/interface/http/middleware"
)

type HttpFiberApp struct {
	Fiber *FiberImpl
}

func NewHttpFiberApp(middleware *middleware.Middleware, service service.BillingService, configService config_service.ConfigService, validatorService validator_service.ValidatorService) (*HttpFiberApp, func()) {
	port := int(configService.GetConfig().Port)
	httpApp, cleaner := NewFiberApp(port, "http", configService)

	httpApp.App.Use(middleware.AuthMiddleware)

	billing_controller.NewBillingController(httpApp.App, service, validatorService)

	return &HttpFiberApp{Fiber: httpApp}, cleaner
}

type HealthFiberApp struct {
	Fiber *FiberImpl
}
