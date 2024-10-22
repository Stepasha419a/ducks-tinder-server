package database

import (
	"bufio"
	"context"
	"fmt"
	"os"
	"strings"

	log "log/slog"

	"github.com/jackc/pgx/v5"

	config_service "{{cookiecutter.module_name}}/internal/domain/service/config"
)

func MigrateDB(pg *PostgresInstance, configService config_service.ConfigService) {
	ctx := context.TODO()

	submitted := submitMigration()

	if !submitted {
		log.Info("migration - canceled")
		return
	}

	log.Info("migration - start")

	runMigrations(ctx, pg, configService)

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

func runMigrations(ctx context.Context, pg *PostgresInstance, configService config_service.ConfigService) {
	checkMigration(initMigration(ctx, pg, configService))
}

func checkMigration(err error) {
	if err != nil {
		log.Info("migration - failed")
		panic(err)
	}
}

func initMigration(ctx context.Context, pg *PostgresInstance, configService config_service.ConfigService) error {
	log.Info("migration - init")

	postgresInstanceUrl := strings.Split(configService.GetConfig().DatabaseUrl, "{{cookiecutter.project_name}}")[0] + "postgres"

	postgresInstance, err := pgx.Connect(ctx, postgresInstanceUrl)
	if err != nil {
		return err
	}

	defer postgresInstance.Close(ctx)

	var dbExists bool
	err = postgresInstance.QueryRow(ctx, `
    SELECT EXISTS (
        SELECT FROM pg_database WHERE datname = '{{cookiecutter.project_name}}'
    )`).Scan(&dbExists)
	if err != nil {
		return err
	}

	if !dbExists {
		_, err = postgresInstance.Exec(ctx, `CREATE DATABASE "{{cookiecutter.project_name}}"`)
		if err != nil {
			return err
		}
	}

	_, err = pg.Pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS {{cookiecutter.entity_multiple}} (
		id UUID PRIMARY KEY,
		property VARCHAR(40) NULL,
		
		created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		return err
	}

	return nil
}
