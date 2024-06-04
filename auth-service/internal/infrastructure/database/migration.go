package database

import (
	"bufio"
	"context"
	"fmt"
	"os"

	log "log/slog"

	"github.com/joho/godotenv"
)

func MigrateDB(db *Postgres) {
	err := godotenv.Load(".env")

	if err != nil {
		panic("Error loading .env file")
	}

	ctx := context.TODO()

	submitted := submitMigration()

	if !submitted {
		log.Info("migration - canceled")
		return
	}

	log.Info("migration - start")

	err = initMigration(ctx, db)
	if err != nil {
		log.Info("migration - failed")
		panic(err)
	}

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

func initMigration(ctx context.Context, db *Postgres) error {
	log.Info("migration - init tables migration")

	_, err := db.Pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS auth_users (
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
