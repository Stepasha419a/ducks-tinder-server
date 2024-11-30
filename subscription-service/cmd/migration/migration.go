package main

import (
	config_service_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/config_impl"
	validator_service_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/validator_impl"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/database"
)

func main() {
	validatorServiceImpl := validator_service_impl.NewValidatorService()
	configService := config_service_impl.NewConfigService(validatorServiceImpl)

	db, cleanup := database.NewPostgresInstance(configService)
	database.MigrateDB(db, configService)

	cleanup()
}
