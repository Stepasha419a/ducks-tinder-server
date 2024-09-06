package main

import (
	config_service "billing-service/internal/domain/service/config"
	"billing-service/internal/infrastructure/database"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"
	fiber_impl "billing-service/internal/interface/http/fiber"

	"github.com/gofiber/fiber/v3"
	"github.com/google/wire"
)

type Container struct {
	ConfigService config_service.ConfigService
	Postgres      *database.PostgresInstance
	App           *fiber.App
}

func newContainer() (*Container, func(), error) {
	panic(wire.Build(
		wire.Bind(new(config_service.ConfigService), new(*config_service_impl.ConfigServiceImpl)),
		config_service_impl.NewConfigService,
		database.NewPostgresInstance,
		fiber_impl.NewFiberApp,
		wire.Struct(new(Container), "*"),
	))
}
