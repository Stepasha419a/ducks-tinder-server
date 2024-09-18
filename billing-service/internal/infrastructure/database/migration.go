package database

import (
	"bufio"
	"context"
	"fmt"
	"os"

	log "log/slog"
)

func MigrateDB(pg *PostgresInstance) {
	ctx := context.TODO()

	submitted := submitMigration()

	if !submitted {
		log.Info("migration - canceled")
		return
	}

	log.Info("migration - start")

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

func runMigrations(ctx context.Context, pg *PostgresInstance) {
	checkMigration(initMigration(ctx, pg))
}

func checkMigration(err error) {
	if err != nil {
		log.Info("migration - failed")
		panic(err)
	}
}

func initMigration(ctx context.Context, pg *PostgresInstance) error {
	log.Info("migration - init tables")

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
		credit_card_id UUID NOT NULL REFERENCES credit_cards(id),
		amount bigint NOT NULL,

		created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		return err
	}

	return nil
}
