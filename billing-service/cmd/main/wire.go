package main

import (
	"billing-service/internal/application/facade"
	"billing-service/internal/application/service"
	"billing-service/internal/domain/repository"
	config_service "billing-service/internal/domain/service/config"
	connection_service "billing-service/internal/domain/service/connection"
	jwt_service "billing-service/internal/domain/service/jwt"
	validator_service "billing-service/internal/domain/service/validator"
	"billing-service/internal/infrastructure/database"
	"billing-service/internal/infrastructure/repository_impl"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"
	context_service "billing-service/internal/infrastructure/service/context"
	tls_service "billing-service/internal/infrastructure/service/tls"
	validator_service_impl "billing-service/internal/infrastructure/service/validator_impl"
	grpc_interface "billing-service/internal/interface/grpc"
	grpc_interceptor "billing-service/internal/interface/grpc/interceptor"
	grpc_billing_service_server_impl "billing-service/internal/interface/grpc/server"
	fiber_impl "billing-service/internal/interface/http/fiber"
	"billing-service/internal/interface/http/middleware"
	"billing-service/proto/gen"
	"context"

	"github.com/google/wire"
	"google.golang.org/grpc"
)

type Container struct {
	Context              context.Context
	ValidatorService     validator_service.ValidatorService
	ConfigService        config_service.ConfigService
	TlsService           *tls_service.TlsService
	Postgres             *database.Postgres
	HttpFiberApp         *fiber_impl.HttpFiberApp
	HealthFiberApp       *fiber_impl.HealthFiberApp
	BillingService       service.BillingService
	JwtService           *jwt_service.JwtService
	BillingServiceServer gen.BillingServiceServer
	GrpcServer           *grpc.Server
}

func newContainer() (*Container, func(), error) {
	panic(wire.Build(
		context_service.NewContext,
		connection_service.NewConnectionService,
		wire.Bind(new(validator_service.ValidatorService), new(*validator_service_impl.ValidatorServiceImpl)),
		validator_service_impl.NewValidatorService,
		wire.Bind(new(config_service.ConfigService), new(*config_service_impl.ConfigServiceImpl)),
		config_service_impl.NewConfigService,
		database.NewPostgresInstance,
		jwt_service.NewJwtService,
		middleware.NewMiddleware,
		fiber_impl.NewHttpFiberApp,
		fiber_impl.NewHealthFiberApp,
		wire.Bind(new(repository.CreditCardRepository), new(*repository_impl.CreditCardRepositoryImpl)),
		repository_impl.NewCreditCardRepository,
		wire.Bind(new(service.BillingService), new(*facade.BillingFacade)),
		facade.NewBillingFacade,
		wire.Bind(new(gen.BillingServiceServer), new(*grpc_billing_service_server_impl.BillingServiceServerImpl)),
		grpc_billing_service_server_impl.NewBillingServiceServerImpl,
		grpc_interceptor.NewInterceptor,
		tls_service.NewTlsService,
		grpc_interface.NewGrpc,
		wire.Struct(new(Container), "*"),
	))
}
