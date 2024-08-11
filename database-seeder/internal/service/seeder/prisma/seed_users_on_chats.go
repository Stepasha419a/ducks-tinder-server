package prisma_seeder

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	UserOnChat struct {
		ChatId           string `json:"chatId" validate:"required"`
		UserId           string `json:"userId" validate:"required"`
		CreatedAt        string `json:"createdAt" validate:"required"`
		LastSeenAt       string `json:"lastSeenAt" validate:"required"`
		NewMessagesCount int16  `json:"newMessagesCount" validate:"required"`
	}
)

func seedUsersOnChats(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - users-on-chats")
	insertQuery := getUsersOnChatsInsertQuery()

	_, err := tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getUsersOnChatsInsertQuery() *string {
	bytes, err := os.ReadFile("data/prisma_postgres/users_on_chats.sql")
	if err != nil {
		panic(err)
	}

	query := string(bytes)

	return &query
}
