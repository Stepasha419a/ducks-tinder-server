package database

import (
	connection_service "auth-service/internal/domain/service/connection"
	"bufio"
	"context"
	"fmt"
	"os"
	"time"

	"log/slog"
)

func MigrateDB(autoSubmit bool) {
	if !autoSubmit {
		submitted := submitMigration()

		if !submitted {
			slog.Info("migration - canceled")
			return
		}
	}

	slog.Info("migration - start")

	connectionService := connection_service.NewConnectionService()

	ctx := context.TODO()

	pg, cleanup := NewPostgresInstance(ctx, connectionService)
	defer cleanup()

	waitForPostgres(ctx, pg)

	runMigrations(ctx, pg)

	slog.Info("migration - successful")
}

func waitForPostgres(ctx context.Context, pg *Postgres) {
	const retryInterval = 2 * time.Second

	for {
		pool, err := pg.GetPool()
		if err == nil && pool != nil {
			return
		}

		slog.Error("Postgres not ready, retrying...", slog.Any("err", err))
		select {
		case <-ctx.Done():
			return
		case <-time.After(retryInterval):
		}
	}
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

func refreshTokenIndexMigration(ctx context.Context, db *Postgres) error {
	log.Info("migration - refresh token index")

	_, err := db.Pool.Exec(ctx, `CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS refresh_token_index ON auth_users (refreshToken)`)

	if err != nil {
		return err
	}
	return nil
}
