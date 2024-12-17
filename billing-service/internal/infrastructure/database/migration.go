package database

import (
	config_service "billing-service/internal/domain/service/config"
	tls_service "billing-service/internal/infrastructure/service/tls"
	"bufio"
	"context"
	"fmt"
	"os"

	log "log/slog"

	"github.com/jackc/pgx/v5"
)

func MigrateDB(pg *PostgresInstance, configService config_service.ConfigService, tlsService *tls_service.TlsService, autoSubmit bool) {
	ctx := context.TODO()

	if !autoSubmit {
		submitted := submitMigration()

		if !submitted {
			log.Info("migration - canceled")
			return
		}
	}

	log.Info("migration - start")

	runMigrations(ctx, pg, configService, tlsService)

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

func runMigrations(ctx context.Context, pg *PostgresInstance, configService config_service.ConfigService, tlsService *tls_service.TlsService) {
	checkMigration(initMigration(ctx, pg, configService, tlsService))
}

func checkMigration(err error) {
	if err != nil {
		log.Info("migration - failed")
		panic(err)
	}
}

func initMigration(ctx context.Context, pg *PostgresInstance, configService config_service.ConfigService, tlsService *tls_service.TlsService) error {
	log.Info("migration - init")

	config := configService.GetConfig()

	connectionString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=require", config.PostgresHost, config.PostgresPort, config.PostgresUser, config.PostgresPassword, config.PostgresRootDatabase)
	pgxConfig, err := pgx.ParseConfig(connectionString)
	if err != nil {
		panic(err)
	}

	pgxConfig.TLSConfig = tlsService.GetConfig()

	postgresInstance, err := pgx.ConnectConfig(context.TODO(), pgxConfig)
	if err != nil {
		panic(err)
	}

	defer postgresInstance.Close(ctx)

	var dbExists bool
	err = postgresInstance.QueryRow(ctx, `
    SELECT EXISTS (
        SELECT FROM pg_database WHERE datname = 'billing-service'
    )`).Scan(&dbExists)
	if err != nil {
		return err
	}

	if !dbExists {
		_, err = postgresInstance.Exec(ctx, `CREATE DATABASE "billing-service"`)
		if err != nil {
			return err
		}
	}

	_, err = pg.Pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS credit_cards (
		id UUID PRIMARY KEY,
		user_id UUID NOT NULL UNIQUE,
		pan VARCHAR(16) NOT NULL,
		holder VARCHAR(40),
		cvc VARCHAR(4),
		expires_at timestamp(3) without time zone NOT NULL,
		
		created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		return err
	}

	_, err = pg.Pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS purchases (
		id UUID PRIMARY KEY,
		credit_card_id UUID NOT NULL REFERENCES credit_cards(id),
		amount bigint NOT NULL,

		created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		return err
	}

	return nil
}
