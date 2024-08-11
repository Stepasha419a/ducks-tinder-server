package prisma_seeder

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	Chat struct {
		Id          string `json:"id" validate:"required"`
		Blocked     string `json:"blocked" validate:"required"`
		BlockedById string `json:"blockedById" validate:"required"`
		CreatedAt   string `json:"createdAt" validate:"required"`
		UpdatedAt   string `json:"updatedAt" validate:"required"`
	}
)

func seedChats(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - chats")
	insertQuery := getChatsInsertQuery()

	_, err := tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getChatsInsertQuery() *string {
	bytes, err := os.ReadFile("data/prisma_postgres/chats.sql")
	if err != nil {
		panic(err)
	}

	query := string(bytes)

	return &query
}
