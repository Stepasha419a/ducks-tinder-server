package main

import (
	config_service_impl "{{cookiecutter.module_name}}/internal/infrastructure/service/config_impl"

	"{{cookiecutter.module_name}}/internal/infrastructure/database"
)

func main() {
	configService := config_service_impl.NewConfigService()

	db, cleanup := database.NewPostgresInstance(configService)
	database.MigrateDB(db)

	cleanup()
}
