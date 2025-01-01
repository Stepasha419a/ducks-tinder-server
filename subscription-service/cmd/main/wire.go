package main

import (
	facade "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/facade"
	service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service"
	repository "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/repository"
	billing_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/billing"
	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	jwt_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/jwt"
	login_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/login"
	validator_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/validator"
	database "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/database"
	repository_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/repository_impl"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/billing_service_impl"
	config_service_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/config_impl"
	login_service_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/login_impl"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
	validator_service_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/validator_impl"
	grpc_interface "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc"
	grpc_interceptor "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc/interceptor"
	grpc_subscription_service_server_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc/server"
	metrics_controller "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/controller/metrics"
	subscription_controller "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/controller/subscription"
	fiber_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/fiber"
	middleware "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/middleware"
	gen "github.com/Stepasha419a/ducks-tinder-server/subscription-service/proto/gen"
	"google.golang.org/grpc"

	"github.com/gofiber/fiber/v3"
	"github.com/google/wire"
)

type Container struct {
	ValidatorService       validator_service.ValidatorService
	ConfigService          config_service.ConfigService
	App                    *fiber.App
	MetricsController      *metrics_controller.MetricsController
	SubscriptionController *subscription_controller.SubscriptionController
	BillingServiceServer   gen.SubscriptionServiceServer
	TlsService             *tls_service.TlsService
	GrpcServer             *grpc.Server
	BillingService         billing_service.BillingService
}

func newContainer() (*Container, func(), error) {
	panic(wire.Build(
		wire.Bind(new(validator_service.ValidatorService), new(*validator_service_impl.ValidatorServiceImpl)),
		validator_service_impl.NewValidatorService,
		wire.Bind(new(config_service.ConfigService), new(*config_service_impl.ConfigServiceImpl)),
		config_service_impl.NewConfigService,
		wire.Bind(new(login_service.LoginService), new(*login_service_impl.LoginServiceImpl)),
		login_service_impl.NewLoginServiceImpl,
		wire.Bind(new(billing_service.BillingService), new(*billing_service_impl.BillingServiceImpl)),
		tls_service.NewTlsService,
		billing_service_impl.NewBillingServiceImpl,
		database.NewPostgresInstance,
		jwt_service.NewJwtService,
		middleware.NewMiddleware,
		fiber_impl.NewFiberApp,
		wire.Bind(new(repository.SubscriptionRepository), new(*repository_impl.SubscriptionRepositoryImpl)),
		repository_impl.NewSubscriptionRepository,
		wire.Bind(new(service.SubscriptionService), new(*facade.SubscriptionFacade)),
		facade.NewSubscriptionFacade,
		subscription_controller.NewSubscriptionController,
		metrics_controller.NewMetricsController,
		wire.Bind(new(gen.SubscriptionServiceServer), new(*grpc_subscription_service_server_impl.SubscriptionServiceServerImpl)),
		grpc_subscription_service_server_impl.NewSubscriptionServiceServerImpl,
		grpc_interceptor.NewInterceptor,
		grpc_interface.NewGrpc,
		provideDbName,
		wire.Struct(new(Container), "*"),
	))
}

func provideDbName(configService config_service.ConfigService) string {
	return configService.GetConfig().PostgresDatabase
}
