package auth_service_seeder

import (
	"context"
	database_service "database-seeder/internal/service/database"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	AuthUser struct {
		Id           string  `json:"id" validate:"required"`
		Email        string  `json:"email" validate:"required"`
		Password     string  `json:"password" validate:"required"`
		RefreshToken *string `json:"refreshToken"`
		CreatedAt    string  `json:"createdAt" validate:"required"`
		UpdatedAt    string  `json:"updatedAt" validate:"required"`
	}
)

func SeedAuthServicePostgres(instance *database_service.AuthServicePostgresInstance) error {
	log.Print("seed auth service postgres - start")

	ctx := context.Background()

	tx, err := instance.Conn.Begin(ctx)

	defer func() {
		if err != nil {
			tx.Rollback(ctx)
		} else {
			tx.Commit(ctx)
		}
	}()

	if err != nil {
		return err
	}

	seedAuthUsers(ctx, tx)

	log.Print("seed auth service postgres - end")

	return nil
}

func seedAuthUsers(ctx context.Context, tx pgx.Tx) error {
	insertQuery, err := getInsertQuery()
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx, "TRUNCATE TABLE auth_users")
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getInsertQuery() (*string, error) {
	bytes, err := os.ReadFile("data/auth_service_postgres/auth_users.sql")
	if err != nil {
		return nil, err
	}

	query := string(bytes)

	return &query, nil
}
