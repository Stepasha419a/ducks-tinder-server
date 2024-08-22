package main

import (
	config_service "billing-service/internal/domain/service/config"
	"billing-service/internal/infrastructure/database"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"

	"github.com/google/wire"
)

type Container struct {
	ConfigService config_service.ConfigService
	Postgres      *database.PostgresInstance
}

func newContainer() (*Container, func(), error) {
	panic(wire.Build(
		wire.Bind(new(config_service.ConfigService), new(*config_service_impl.ConfigServiceImpl)),
		config_service_impl.NewConfigService,
		database.NewPostgresInstance,
		wire.Struct(new(Container), "*"),
	))
}
