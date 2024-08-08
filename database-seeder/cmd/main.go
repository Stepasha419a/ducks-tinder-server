package main

import (
	config_service "database-seeder/internal/service/config"
	database_service "database-seeder/internal/service/database"
	seeder_service "database-seeder/internal/service/seeder"
)

func main() {
	config_service.RequireConfig()
	databaseInstances := database_service.InitDatabaseInstances()

	defer func() {
		databaseInstances.Close()
	}()

	seeder_service.Seed(databaseInstances)
}
