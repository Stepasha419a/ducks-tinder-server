package prisma_seeder

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	Message struct {
		Id        string  `json:"id" validate:"required"`
		UserId    string  `json:"userId" validate:"required"`
		ChatId    string  `json:"chatId" validate:"required"`
		Text      string  `json:"text" validate:"required"`
		RepliedId *string `json:"repliedId" validate:"required"`

		CreatedAt string `json:"createdAt" validate:"required"`
		UpdatedAt string `json:"updatedAt" validate:"required"`
	}
)

func seedMessages(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - messages")
	insertQuery := getMessagesInsertQuery()

	_, err := tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getMessagesInsertQuery() *string {
	bytes, err := os.ReadFile("data/prisma_postgres/messages.sql")
	if err != nil {
		panic(err)
	}

	query := string(bytes)

	return &query
}
