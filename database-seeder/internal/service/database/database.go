package database_service

import (
	"context"
	config_service "database-seeder/internal/service/config"
	"log"

	"github.com/jackc/pgx/v5"
)

type (
	DatabaseInstances struct {
		PrismaPostgresInstance      *PrismaPostgresInstance
		AuthServicePostgresInstance *AuthServicePostgresInstance
	}

	PrismaPostgresInstance struct {
		Conn *pgx.Conn
	}
	AuthServicePostgresInstance struct {
		Conn *pgx.Conn
	}
)

var (
	databaseInstances *DatabaseInstances
)

func InitDatabaseInstances() *DatabaseInstances {
	prismaPostgresInstance := newPrismaPostgresInstance()
	authServicePostgresInstance := newAuthServicePostgresInstance()

	databaseInstances = &DatabaseInstances{prismaPostgresInstance, authServicePostgresInstance}

	log.Print("database instances init")

	return databaseInstances
}

func newPrismaPostgresInstance() *PrismaPostgresInstance {
	conn, err := pgx.Connect(context.TODO(), config_service.GetConfig().PrismaDatabaseUrl)
	if err != nil {
		panic(err)
	}

	return &PrismaPostgresInstance{conn}
}

func newAuthServicePostgresInstance() *AuthServicePostgresInstance {
	conn, err := pgx.Connect(context.TODO(), config_service.GetConfig().AuthServiceDatabaseUrl)
	if err != nil {
		panic(err)
	}

	return &AuthServicePostgresInstance{conn}
}

func (di *DatabaseInstances) Close() {
	di.PrismaPostgresInstance.Conn.Close(context.TODO())
	di.AuthServicePostgresInstance.Conn.Close(context.TODO())

	log.Print("database instances close")
}
