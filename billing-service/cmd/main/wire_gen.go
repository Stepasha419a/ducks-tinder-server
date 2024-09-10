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
	"billing-service/internal/infrastructure/database"
	"billing-service/internal/infrastructure/repository_impl"
	"billing-service/internal/infrastructure/service/config_impl"
	"billing-service/internal/interface/http/fiber"
	"github.com/gofiber/fiber/v3"
)

// Injectors from wire.go:

func newContainer() (*Container, func(), error) {
	configServiceImpl := config_service_impl.NewConfigService()
	postgresInstance, cleanup := database.NewPostgresInstance(configServiceImpl)
	jwtService := jwt_service.NewJwtService(configServiceImpl)
	creditCardRepositoryImpl := repository_impl.NewCreditCardRepository(postgresInstance)
	billingFacade := facade.NewBillingFacade(creditCardRepositoryImpl)
	container := &Container{
		ConfigService:     configServiceImpl,
		Postgres:          postgresInstance,
		App:               app,
		BillingService:    billingFacade,
		JwtService:        jwtService,
	}
	return container, func() {
		cleanup2()
		cleanup()
	}, nil
}

// wire.go:

type Container struct {
	ConfigService     config_service.ConfigService
	Postgres          *database.PostgresInstance
	App               *fiber.App
	BillingService    service.BillingService
	JwtService        *jwt_service.JwtService
}
