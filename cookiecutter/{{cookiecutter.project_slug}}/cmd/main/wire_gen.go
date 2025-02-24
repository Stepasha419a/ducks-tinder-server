// Code generated by Wire. DO NOT EDIT.

//go:generate go run -mod=mod github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package main

import (
	"{{cookiecutter.module_name}}/internal/application/facade"
	"{{cookiecutter.module_name}}/internal/domain/service/config"
	"{{cookiecutter.module_name}}/internal/domain/service/jwt"
	"{{cookiecutter.module_name}}/internal/domain/service/validator"
	"{{cookiecutter.module_name}}/internal/infrastructure/database"
	"{{cookiecutter.module_name}}/internal/infrastructure/repository_impl"
	"{{cookiecutter.module_name}}/internal/infrastructure/service/config_impl"
	"{{cookiecutter.module_name}}/internal/infrastructure/service/validator_impl"
	"{{cookiecutter.module_name}}/internal/interface/http/controller/{{cookiecutter.__project_name_without_service_postfix_underline}}"
	"{{cookiecutter.module_name}}/internal/interface/http/controller/metrics"
	"{{cookiecutter.module_name}}/internal/interface/http/fiber"
	"{{cookiecutter.module_name}}/internal/interface/http/middleware"
	"github.com/gofiber/fiber/v3"
)

// Injectors from wire.go:

func newContainer() (*Container, func(), error) {
	validatorServiceImpl := validator_service_impl.NewValidatorService()
	configServiceImpl := config_service_impl.NewConfigService(validatorServiceImpl)
	postgresInstance, cleanup := database.NewPostgresInstance(configServiceImpl)
	jwtService := jwt_service.NewJwtService(configServiceImpl)
	middlewareMiddleware := middleware.NewMiddleware(jwtService)
	app, cleanup2 := fiber_impl.NewFiberApp(middlewareMiddleware, configServiceImpl)
	{{cookiecutter.__entity_low_camel_case}}RepositoryImpl := repository_impl.New{{cookiecutter.__entity_repository}}(postgresInstance)
	{{cookiecutter.__project_name_without_service_postfix_low_camel_case}}Facade := facade.New{{cookiecutter.__project_name_without_service_postfix_camel_case}}Facade({{cookiecutter.__entity_low_camel_case}}RepositoryImpl)
	metricsController := metrics_controller.NewMetricsController(app)
	{{cookiecutter.__project_name_without_service_postfix_low_camel_case}}Controller := {{cookiecutter.__project_name_without_service_postfix_underline}}_controller.New{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller(app, {{cookiecutter.__project_name_without_service_postfix_low_camel_case}}Facade, validatorServiceImpl)
	container := &Container{
		ValidatorService:     validatorServiceImpl,
		ConfigService:        configServiceImpl,
		App:                  app,
		MetricsController:    metricsController,
		{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller:    {{cookiecutter.__project_name_without_service_postfix_low_camel_case}}Controller,
	}
	return container, func() {
		cleanup2()
		cleanup()
	}, nil
}

// wire.go:

type Container struct {
	ValidatorService     validator_service.ValidatorService
	ConfigService        config_service.ConfigService
	App                  *fiber.App
	MetricsController    *metrics_controller.MetricsController
	{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller    *{{cookiecutter.__project_name_without_service_postfix_underline}}_controller.{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller
}
