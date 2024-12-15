package database

import (
	config_service "auth-service/internal/infrastructure/service/config"
	tls_service "auth-service/internal/infrastructure/service/tls"
	"bufio"
	"context"
	"fmt"
	"os"

	log "log/slog"

	"github.com/jackc/pgx/v5"
)

func MigrateDB(db *Postgres, autoSubmit bool) {
	ctx := context.TODO()

	if !autoSubmit {
		submitted := submitMigration()

		if !submitted {
			log.Info("migration - canceled")
			return
		}
	}

	log.Info("migration - start")

	runMigrations(ctx, db)

	log.Info("migration - successful")
}

func submitMigration() bool {
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Print("migration - submit (y/n): ")
	submitted := false
	for scanner.Scan() {
		text := scanner.Text()
		if text != "" {
			if text == "y" {
				submitted = true
			}

			return submitted
		}
	}
	return submitted
}

func runMigrations(ctx context.Context, db *Postgres) {
	checkMigration(initMigration(ctx, db))
	checkMigration(refreshTokenIndexMigration(ctx, db))
}

func checkMigration(err error) {
	if err != nil {
		log.Info("migration - failed")
		panic(err)
	}
}

func initMigration(ctx context.Context, db *Postgres) error {
	log.Info("migration - init")

	tlsConfig := tls_service.GetConfig()
	config := config_service.GetConfig()

	connectionString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=require", config.PostgresHost, config.PostgresPort, config.PostgresUser, config.PostgresPassword, config.PostgresRootDatabase)
	pgxConfig, err := pgx.ParseConfig(connectionString)
	if err != nil {
		panic(err)
	}

	pgxConfig.TLSConfig = tlsConfig

	postgresInstance, err := pgx.ConnectConfig(context.TODO(), pgxConfig)
	if err != nil {
		panic(err)
	}

	defer postgresInstance.Close(ctx)

	var dbExists bool
	err = postgresInstance.QueryRow(ctx, `
    SELECT EXISTS (
        SELECT FROM pg_database WHERE datname = 'auth-service'
    )`).Scan(&dbExists)
	if err != nil {
		return err
	}

	if !dbExists {
		_, err = postgresInstance.Exec(ctx, `CREATE DATABASE "auth-service"`)
		if err != nil {
			return err
		}
	}

	_, err = db.Pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS auth_users (
		id UUID PRIMARY KEY,
		email VARCHAR(100) NOT NULL UNIQUE,
		password VARCHAR(255) NOT NULL,
		refreshToken text,
		createdAt timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updatedAt timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)

	if err != nil {
		return err
	}
	return nil
}

func refreshTokenIndexMigration(ctx context.Context, db *Postgres) error {
	log.Info("migration - refresh token index")

	_, err := db.Pool.Exec(ctx, `CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS refresh_token_index ON auth_users (refreshToken)`)

	if err != nil {
		return err
	}
	return nil
}
