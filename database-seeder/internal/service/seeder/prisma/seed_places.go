package prisma_seeder

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	Place struct {
		Id        string `json:"id" validate:"required"`
		Latitude  string `json:"latitude" validate:"required"`
		Longitude string `json:"longitude" validate:"required"`
		Address   string `json:"address" validate:"required"`
		Name      string `json:"name" validate:"required"`

		CreatedAt string `json:"createdAt" validate:"required"`
		UpdatedAt string `json:"updatedAt" validate:"required"`
	}
)

func seedPlaces(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - places")
	insertQuery := getPlacesInsertQuery()

	_, err := tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getPlacesInsertQuery() *string {
	bytes, err := os.ReadFile("data/prisma_postgres/places.sql")
	if err != nil {
		panic(err)
	}

	query := string(bytes)

	return &query
}
