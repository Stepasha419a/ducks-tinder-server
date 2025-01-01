package database

import (
	"bufio"
	"context"
	"fmt"
	"os"

	"log"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
)

func MigrateDB(configService config_service.ConfigService, tlsService *tls_service.TlsService, autoSubmit bool) {
	ctx := context.TODO()

	if !autoSubmit {
		submitted := submitMigration()

		if !submitted {
			log.Println("migration - canceled")
			return
		}
	}

	log.Println("migration - start")

	rootPg, cleanupRootDb := NewPostgresInstance(configService, tlsService, configService.GetConfig().PostgresRootDatabase)
	defer cleanupRootDb()
	runRootMigrations(ctx, rootPg)

	pg, cleanup := NewPostgresInstance(configService, tlsService, configService.GetConfig().PostgresDatabase)
	defer cleanup()
	runMigrations(ctx, pg)

	log.Println("migration - successful")
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

func runRootMigrations(ctx context.Context, pg *PostgresInstance) {
	checkMigration(initRootMigration(ctx, pg))
}

func runMigrations(ctx context.Context, pg *PostgresInstance) {
	checkMigration(initMigration(ctx, pg))
}

func checkMigration(err error) {
	if err != nil {
		log.Println("migration - failed")
		panic(err)
	}
}

func initRootMigration(ctx context.Context, pg *PostgresInstance) error {
	log.Println("root migration - init")

	var dbExists bool
	err := pg.Pool.QueryRow(ctx, `
    SELECT EXISTS (
        SELECT FROM pg_database WHERE datname = 'subscription-service'
    )`).Scan(&dbExists)
	if err != nil {
		return err
	}

	if dbExists {
		return nil
	}

	_, err = pg.Pool.Exec(ctx, `CREATE DATABASE "subscription-service"`)
	if err != nil {
		return err
	}

	return nil
}

func initMigration(ctx context.Context, pg *PostgresInstance) error {
	log.Println("migration - init")

	_, err := pg.Pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS subscriptions (
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
