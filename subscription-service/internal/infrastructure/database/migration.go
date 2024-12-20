package database

import (
	"bufio"
	"context"
	"fmt"
	"os"

	log "log/slog"

	"github.com/jackc/pgx/v5"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
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
		return err
	}

	defer postgresInstance.Close(ctx)

	var dbExists bool
	err = postgresInstance.QueryRow(ctx, `
    SELECT EXISTS (
        SELECT FROM pg_database WHERE datname = 'subscription-service'
    )`).Scan(&dbExists)
	if err != nil {
		return err
	}

	if !dbExists {
		_, err = postgresInstance.Exec(ctx, `CREATE DATABASE "subscription-service"`)
		if err != nil {
			return err
		}
	}

	_, err = pg.Pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS subscriptions (
		user_id UUID PRIMARY KEY,
		subscription VARCHAR(40) NOT NULL,
		login VARCHAR(39) NOT NULL,
		
		expires_at timestamp(3) without time zone,
		created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		return err
	}

	return nil
}
