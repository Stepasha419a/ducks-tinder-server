package billing_service_seeder

import (
	"context"
	database_service "database-seeder/internal/service/database"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
)

type (
	CreditCard struct {
		Id        string    `json:"id" validate:"required"`
		UserId    string    `json:"userId" validate:"required"`
		Pan       string    `json:"pan" validate:"required"`
		Holder    string    `json:"holder" validate:"required"`
		Cvc       string    `json:"cvc" validate:"required"`
		ExpiresAt time.Time `json:"expiresAt" validate:"required"`

		CreatedAt time.Time `json:"createdAt"`
		UpdatedAt time.Time `json:"updatedAt"`
	}
)

func SeedBillingServicePostgres(instance *database_service.BillingServicePostgresInstance) error {
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

	err = seedCreditCards(ctx, tx)
	if err != nil {
		return err
	}

	return nil
}

func seedCreditCards(ctx context.Context, tx pgx.Tx) error {
	insertQuery, err := getInsertQuery()
	if err != nil {
		return err
	}

	log.Print("seed billing service postgres - truncating tables")

	_, err = tx.Exec(ctx, "TRUNCATE TABLE credit_cards CASCADE")
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx, "TRUNCATE TABLE purchases CASCADE")
	if err != nil {
		return err
	}

	log.Print("seed billing service postgres - seeding")

	_, err = tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getInsertQuery() (*string, error) {
	bytes, err := os.ReadFile("data/billing_service_postgres/billing.sql")
	if err != nil {
		return nil, err
	}

	query := string(bytes)

	return &query, nil
}
