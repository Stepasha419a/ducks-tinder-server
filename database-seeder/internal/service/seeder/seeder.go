package seeder_service

import (
	database_service "database-seeder/internal/service/database"
	auth_service_seeder "database-seeder/internal/service/seeder/auth_service"
	prisma_seeder "database-seeder/internal/service/seeder/prisma"
	"log"
)

func Seed(databaseInstances *database_service.DatabaseInstances) {
	err := auth_service_seeder.SeedAuthServicePostgres(databaseInstances.AuthServicePostgresInstance)
	if err != nil {
		log.Print("seed auth service postgres - error")
		panic(err)
	}

	err = prisma_seeder.SeedPrismaPostgres(databaseInstances.PrismaPostgresInstance)
	if err != nil {
		log.Print("seed prisma postgres - error")
		panic(err)
	}
}
