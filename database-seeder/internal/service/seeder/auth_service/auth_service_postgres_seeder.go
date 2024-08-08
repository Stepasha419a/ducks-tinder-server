package auth_service_seeder

import (
	"context"
	database_service "database-seeder/internal/service/database"
	"encoding/json"
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
	authUsers := getSeedData()

	_, err := tx.Exec(ctx, "TRUNCATE TABLE auth_users")
	if err != nil {
		return err
	}

	query := "INSERT INTO auth_users (id, email, password, refreshToken, createdAt, updatedAt) VALUES (@id, @email, @password, @refreshToken, @createdAt, @updatedAt)"

	batch := &pgx.Batch{}

	for _, authUser := range authUsers {
		args := pgx.NamedArgs{
			"id":           authUser.Id,
			"email":        authUser.Email,
			"password":     authUser.Password,
			"refreshToken": authUser.RefreshToken,
			"createdAt":    authUser.CreatedAt,
			"updatedAt":    authUser.UpdatedAt,
		}

		batch.Queue(query, args)
	}

	results := tx.SendBatch(ctx, batch)
	defer results.Close()

	for range authUsers {
		_, err := results.Exec()
		if err != nil {
			return err
		}
	}

	return nil
}

func getSeedData() []AuthUser {
	bytes, err := os.ReadFile("internal/service/seeder/auth_service/data.json")
	if err != nil {
		panic(err)
	}

	authUsers := []AuthUser{}
	err = json.Unmarshal(bytes, &authUsers)
	if err != nil {
		panic(err)
	}

	return authUsers
}
