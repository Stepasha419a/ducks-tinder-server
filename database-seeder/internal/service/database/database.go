package database_service

import (
	"context"
	config_service "database-seeder/internal/service/config"
	"log"

	"github.com/jackc/pgx/v5"
)

type (
	DatabaseInstances struct {
		PrismaPostgresInstance         *PrismaPostgresInstance
		AuthServicePostgresInstance    *AuthServicePostgresInstance
		BillingServicePostgresInstance *BillingServicePostgresInstance
		MapServicePostgresInstance     *MapServicePostgresInstance
	}

	PrismaPostgresInstance struct {
		Conn *pgx.Conn
	}
	AuthServicePostgresInstance struct {
		Conn *pgx.Conn
	}
	BillingServicePostgresInstance struct {
		Conn *pgx.Conn
	}
	MapServicePostgresInstance struct {
		Conn *pgx.Conn
	}
)

var (
	databaseInstances *DatabaseInstances
)

func InitDatabaseInstances() *DatabaseInstances {
	prismaPostgresInstance := newPrismaPostgresInstance()
	authServicePostgresInstance := newAuthServicePostgresInstance()
	billingServicePostgresInstance := newBillingServicePostgresInstance()
	mapServicePostgresInstance := newMapServicePostgresInstance()

	databaseInstances = &DatabaseInstances{prismaPostgresInstance, authServicePostgresInstance, billingServicePostgresInstance, mapServicePostgresInstance}

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

func newBillingServicePostgresInstance() *BillingServicePostgresInstance {
	conn, err := pgx.Connect(context.TODO(), config_service.GetConfig().BillingServiceDatabaseUrl)
	if err != nil {
		panic(err)
	}

	return &BillingServicePostgresInstance{conn}
}

func newMapServicePostgresInstance() *MapServicePostgresInstance {
	conn, err := pgx.Connect(context.TODO(), config_service.GetConfig().MapServiceDatabaseUrl)
	if err != nil {
		panic(err)
	}

	return &MapServicePostgresInstance{conn}
}

func (di *DatabaseInstances) Close() {
	ctx := context.TODO()

	di.PrismaPostgresInstance.Conn.Close(ctx)
	di.AuthServicePostgresInstance.Conn.Close(ctx)
	di.BillingServicePostgresInstance.Conn.Close(ctx)
	di.BillingServicePostgresInstance.Conn.Close(ctx)

	log.Print("database instances close")
}
