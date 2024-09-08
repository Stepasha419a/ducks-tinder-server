package main

import (
	"billing-service/internal/domain/repository"
	config_service "billing-service/internal/domain/service/config"
	"billing-service/internal/infrastructure/database"
	"billing-service/internal/infrastructure/repository_impl"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"
	fiber_impl "billing-service/internal/interface/http/fiber"

	"github.com/gofiber/fiber/v3"
	"github.com/google/wire"
)

type Container struct {
	ConfigService        config_service.ConfigService
	Postgres             *database.PostgresInstance
	App                  *fiber.App
	CreditCardRepository repository.CreditCardRepository
}

func newContainer() (*Container, func(), error) {
	panic(wire.Build(
		wire.Bind(new(config_service.ConfigService), new(*config_service_impl.ConfigServiceImpl)),
		config_service_impl.NewConfigService,
		database.NewPostgresInstance,
		fiber_impl.NewFiberApp,
		wire.Bind(new(repository.CreditCardRepository), new(*repository_impl.CreditCardRepositoryImpl)),
		repository_impl.NewCreditCardRepository,
		wire.Struct(new(Container), "*"),
	))
}
