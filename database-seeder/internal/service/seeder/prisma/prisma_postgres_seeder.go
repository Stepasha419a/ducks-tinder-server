package prisma_seeder

import (
	"context"
	database_service "database-seeder/internal/service/database"
	"log"

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

func SeedPrismaPostgres(instance *database_service.PrismaPostgresInstance) error {
	log.Print("seed prisma postgres - start")

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

	err = truncateTables(ctx, tx)
	if err != nil {
		return err
	}

	err = seedUsers(ctx, tx)
	if err != nil {
		return err
	}

	err = seedUsersOnInterests(ctx, tx)
	if err != nil {
		return err
	}

	err = seedPlaces(ctx, tx)
	if err != nil {
		return err
	}

	err = seedCheckedUsers(ctx, tx)
	if err != nil {
		return err
	}

	err = seedPairs(ctx, tx)
	if err != nil {
		return err
	}

	log.Print("seed prisma postgres - end")

	return nil
}

func truncateTables(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - truncating tables")

	_, err := tx.Exec(ctx, `
	TRUNCATE TABLE messages CASCADE;
	TRUNCATE TABLE "users-on-chats" CASCADE;
	TRUNCATE TABLE "checked-users" CASCADE;
	TRUNCATE TABLE chats CASCADE;
	TRUNCATE TABLE "_Pairs" CASCADE;
	TRUNCATE TABLE "users-on-interests" CASCADE;
	TRUNCATE TABLE pictures CASCADE;
	TRUNCATE TABLE places CASCADE;
	TRUNCATE TABLE users CASCADE;
	`)

	if err != nil {
		return err
	}

	return nil
}
