package prisma_seeder

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	UserOnInterest struct {
		UserId   string `json:"userId" validate:"required"`
		Interest string `json:"interest" validate:"required"`
	}
)

func seedUsersOnInterests(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - users-on-interests")
	insertQuery := getUsersOnInterestsInsertQuery()

	_, err := tx.Exec(ctx, *insertQuery)
	if err != nil {
		return err
	}

	return nil
}

func getUsersOnInterestsInsertQuery() *string {
	bytes, err := os.ReadFile("data/prisma_postgres/users_on_interests.sql")
	if err != nil {
		panic(err)
	}

	query := string(bytes)

	return &query
}
