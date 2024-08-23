package main

import (
	"billing-service/internal/infrastructure/database"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"
)

func main() {
	configService := config_service_impl.NewConfigService()

	db := database.NewPostgresInstance(configService)
	database.MigrateDB(db)
}
