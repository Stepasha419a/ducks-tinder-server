package database

import (
	config_service "billing-service/internal/domain/service/config"
	connection_service "billing-service/internal/domain/service/connection"
	tls_service "billing-service/internal/infrastructure/service/tls"
	"bufio"
	"context"
	"fmt"
	"os"

	log "log/slog"
)

func MigrateDB(configService config_service.ConfigService, tlsService *tls_service.TlsService, autoSubmit bool) {
	ctx := context.TODO()

	if !autoSubmit {
		submitted := submitMigration()

		if !submitted {
			log.Info("migration - canceled")
			return
		}
	}

	log.Info("migration - start")

	connectionService := connection_service.NewConnectionService()

	pg, cleanup := NewPostgresInstance(ctx, configService, tlsService, connectionService)
	defer cleanup()
	runMigrations(ctx, pg)

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

func runMigrations(ctx context.Context, pg *Postgres) {
	checkMigration(initMigration(ctx, pg))
}

func checkMigration(err error) {
	if err != nil {
		log.Info("migration - failed")
		panic(err)
	}
}

func initMigration(ctx context.Context, pg *Postgres) error {
	log.Info("migration - init")

	_, err := pg.Pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS credit_cards (
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
		credit_card_id UUID REFERENCES credit_cards(id) on delete set null,
		user_id UUID NOT NULL,
		amount bigint NOT NULL,

		created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		return err
	}

	return nil
}
