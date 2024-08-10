package prisma_seeder

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	CheckedUser struct {
		CheckedId    string `json:"checkedId" validate:"required"`
		WasCheckedId string `json:"wasCheckedId" validate:"required"`

		CreatedAt string `json:"createdAt" validate:"required"`
		UpdatedAt string `json:"updatedAt" validate:"required"`
	}
)

func seedCheckedUsers(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - checked-users")
	insertQuery := getCheckedUsersInsertQuery()

	_, err := tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getCheckedUsersInsertQuery() *string {
	bytes, err := os.ReadFile("data/prisma_postgres/checked_users.sql")
	if err != nil {
		panic(err)
	}

	query := string(bytes)

	return &query
}
