package main

import (
	"{{cookiecutter.module_name}}/internal/application/facade"
	"{{cookiecutter.module_name}}/internal/application/service"
	"{{cookiecutter.module_name}}/internal/domain/repository"
	config_service "{{cookiecutter.module_name}}/internal/domain/service/config"
	jwt_service "{{cookiecutter.module_name}}/internal/domain/service/jwt"
	validator_service "{{cookiecutter.module_name}}/internal/domain/service/validator"
	"{{cookiecutter.module_name}}/internal/infrastructure/database"
	"{{cookiecutter.module_name}}/internal/infrastructure/repository_impl"
	config_service_impl "{{cookiecutter.module_name}}/internal/infrastructure/service/config_impl"
	validator_service_impl "{{cookiecutter.module_name}}/internal/infrastructure/service/validator_impl"

	{{cookiecutter.__project_name_without_service_postfix_underline}}_controller "{{cookiecutter.module_name}}/internal/interface/http/controller/{{cookiecutter.__project_name_without_service_postfix}}"
	metrics_controller "{{cookiecutter.module_name}}/internal/interface/http/controller/metrics"
	fiber_impl "{{cookiecutter.module_name}}/internal/interface/http/fiber"
	"{{cookiecutter.module_name}}/internal/interface/http/middleware"

	"github.com/gofiber/fiber/v3"
	"github.com/google/wire"
)

type Container struct {
	ValidatorService     validator_service.ValidatorService
	ConfigService        config_service.ConfigService
	App                  *fiber.App
	MetricsController    *metrics_controller.MetricsController
	{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller    *{{cookiecutter.__project_name_without_service_postfix_underline}}_controller.{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller
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
		wire.Bind(new(repository.{{cookiecutter.__entity_repository}}), new(*repository_impl.{{cookiecutter.__entity_repository}}Impl)),
		repository_impl.New{{cookiecutter.__entity_repository}},
		wire.Bind(new(service.{{cookiecutter.__project_name_without_service_postfix_camel_case}}Service), new(*facade.{{cookiecutter.__project_name_without_service_postfix_camel_case}}Facade)),
		facade.New{{cookiecutter.__project_name_without_service_postfix_camel_case}}Facade,
		{{cookiecutter.__project_name_without_service_postfix_underline}}_controller.New{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller,
		metrics_controller.NewMetricsController,
		wire.Struct(new(Container), "*"),
	))
}
