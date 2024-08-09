package seeder_service

import (
	database_service "database-seeder/internal/service/database"
	auth_service_seeder "database-seeder/internal/service/seeder/auth_service"
	"log"
)

func Seed(databaseInstances *database_service.DatabaseInstances) {
	err := auth_service_seeder.SeedAuthServicePostgres(databaseInstances.AuthServicePostgresInstance)
	if err != nil {
		log.Print("seed auth service postgres - error")
		panic(err)
	}
}
