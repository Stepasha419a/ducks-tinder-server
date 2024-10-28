// Code generated by Wire. DO NOT EDIT.

//go:generate go run -mod=mod github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package main

import (
	"billing-service/internal/application/facade"
	"billing-service/internal/application/service"
	"billing-service/internal/domain/service/config"
	"billing-service/internal/domain/service/jwt"
	"billing-service/internal/domain/service/validator"
	"billing-service/internal/infrastructure/database"
	"billing-service/internal/infrastructure/repository_impl"
	"billing-service/internal/infrastructure/service/config_impl"
	"billing-service/internal/infrastructure/service/validator_impl"
	"billing-service/internal/interface/grpc"
	"billing-service/internal/interface/grpc/interceptor"
	"billing-service/internal/interface/grpc/server"
	"billing-service/internal/interface/http/controller/billing"
	"billing-service/internal/interface/http/controller/metrics"
	"billing-service/internal/interface/http/fiber"
	"billing-service/internal/interface/http/middleware"
	"billing-service/proto/gen"
	"github.com/gofiber/fiber/v3"
	"google.golang.org/grpc"
)

// Injectors from wire.go:

func newContainer() (*Container, func(), error) {
	validatorServiceImpl := validator_service_impl.NewValidatorService()
	configServiceImpl := config_service_impl.NewConfigService(validatorServiceImpl)
	postgresInstance, cleanup := database.NewPostgresInstance(configServiceImpl)
	jwtService := jwt_service.NewJwtService(configServiceImpl)
	middlewareMiddleware := middleware.NewMiddleware(jwtService)
	app, cleanup2 := fiber_impl.NewFiberApp(middlewareMiddleware, configServiceImpl)
	creditCardRepositoryImpl := repository_impl.NewCreditCardRepository(postgresInstance)
	billingFacade := facade.NewBillingFacade(creditCardRepositoryImpl)
	metricsController := metrics_controller.NewMetricsController(app)
	billingController := billing_controller.NewBillingController(app, billingFacade, validatorServiceImpl)
	billingServiceServerImpl := grpc_billing_service_server_impl.NewBillingServiceServerImpl(billingFacade, validatorServiceImpl)
	grpcInterceptor := grpc_interceptor.NewInterceptor(jwtService)
	server, cleanup3, err := grpc_interface.NewGrpc(billingServiceServerImpl, grpcInterceptor)
	if err != nil {
		cleanup2()
		cleanup()
		return nil, nil, err
	}
	container := &Container{
		ValidatorService:     validatorServiceImpl,
		ConfigService:        configServiceImpl,
		Postgres:             postgresInstance,
		App:                  app,
		BillingService:       billingFacade,
		JwtService:           jwtService,
		MetricsController:    metricsController,
		BillingController:    billingController,
		BillingServiceServer: billingServiceServerImpl,
		GrpcServer:           server,
	}
	return container, func() {
		cleanup3()
		cleanup2()
		cleanup()
	}, nil
}

// wire.go:

type Container struct {
	ValidatorService     validator_service.ValidatorService
	ConfigService        config_service.ConfigService
	Postgres             *database.PostgresInstance
	App                  *fiber.App
	BillingService       service.BillingService
	JwtService           *jwt_service.JwtService
	MetricsController    *metrics_controller.MetricsController
	BillingController    *billing_controller.BillingController
	BillingServiceServer gen.BillingServiceServer
	GrpcServer           *grpc.Server
}
