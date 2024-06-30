package main

import (
	"auth-service/internal/infrastructure/database"
	config_service "auth-service/internal/infrastructure/service/config"
)

func main() {
	config_service.RequireConfig()

	db := database.NewPostgresInstance()
	database.MigrateDB(db)
}
