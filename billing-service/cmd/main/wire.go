package main

import (
	"billing-service/internal/application/facade"
	"billing-service/internal/application/service"
	"billing-service/internal/domain/repository"
	config_service "billing-service/internal/domain/service/config"
	jwt_service "billing-service/internal/domain/service/jwt"
	validator_service "billing-service/internal/domain/service/validator"
	"billing-service/internal/infrastructure/database"
	"billing-service/internal/infrastructure/repository_impl"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"
	validator_service_impl "billing-service/internal/infrastructure/service/validator_impl"
	grpc_interface "billing-service/internal/interface/grpc"
	grpc_interceptor "billing-service/internal/interface/grpc/interceptor"
	grpc_billing_service_server_impl "billing-service/internal/interface/grpc/server"
	billing_controller "billing-service/internal/interface/http/controller/billing"
	metrics_controller "billing-service/internal/interface/http/controller/metrics"
	fiber_impl "billing-service/internal/interface/http/fiber"
	"billing-service/internal/interface/http/middleware"
	"billing-service/proto/gen"

	"github.com/gofiber/fiber/v3"
	"github.com/google/wire"
	"google.golang.org/grpc"
)

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

func newContainer() (*Container, func(), error) {
	panic(wire.Build(
		wire.Bind(new(validator_service.ValidatorService), new(*validator_service_impl.ValidatorServiceImpl)),
		validator_service_impl.NewValidatorService,
		wire.Bind(new(config_service.ConfigService), new(*config_service_impl.ConfigServiceImpl)),
		config_service_impl.NewConfigService,
		database.NewPostgresInstance,
		jwt_service.NewJwtService,
		middleware.NewMiddleware,
		fiber_impl.NewFiberApp,
		wire.Bind(new(repository.CreditCardRepository), new(*repository_impl.CreditCardRepositoryImpl)),
		repository_impl.NewCreditCardRepository,
		wire.Bind(new(service.BillingService), new(*facade.BillingFacade)),
		facade.NewBillingFacade,
		billing_controller.NewBillingController,
		metrics_controller.NewMetricsController,
		wire.Bind(new(gen.BillingServiceServer), new(*grpc_billing_service_server_impl.BillingServiceServerImpl)),
		grpc_billing_service_server_impl.NewBillingServiceServerImpl,
		grpc_interceptor.NewInterceptor,
		grpc_interface.NewGrpc,
		wire.Struct(new(Container), "*"),
	))
}
