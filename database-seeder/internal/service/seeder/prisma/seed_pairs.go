package prisma_seeder

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	Pair struct {
		A string `json:"A" validate:"required"`
		B string `json:"B" validate:"required"`
	}
)

func seedPairs(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - pairs")
	insertQuery := getPairsInsertQuery()

	_, err := tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getPairsInsertQuery() *string {
	bytes, err := os.ReadFile("data/prisma_postgres/pairs.sql")
	if err != nil {
		panic(err)
	}

	query := string(bytes)

	return &query
}
