package main

import (
	config_service "billing-service/internal/domain/service/config"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"

	"github.com/google/wire"
)

type Container struct {
	ConfigService *config_service.ConfigService
}

func newContainer() (config_service.ConfigService, func(), error) {
	panic(wire.Build(
		wire.Bind(new(config_service.ConfigService), new(*config_service_impl.ConfigServiceImpl)),
		config_service_impl.NewConfigService,
	))
}
