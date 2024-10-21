package main

import (
	"billing-service/internal/infrastructure/database"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"
	validator_service_impl "billing-service/internal/infrastructure/service/validator_impl"
)

func main() {
	validatorServiceImpl := validator_service_impl.NewValidatorService()
	configService := config_service_impl.NewConfigService(validatorServiceImpl)

	db, cleanup := database.NewPostgresInstance(configService)
	database.MigrateDB(db, configService)

	cleanup()
}
