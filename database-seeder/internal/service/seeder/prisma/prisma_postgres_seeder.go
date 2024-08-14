package prisma_seeder

import (
	"context"
	config_service "database-seeder/internal/service/config"
	database_service "database-seeder/internal/service/database"
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

func SeedPrismaPostgres(instance *database_service.PrismaPostgresInstance) error {
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

	err = deleteFileServiceStaticPictures()
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

	err = seedChats(ctx, tx)
	if err != nil {
		return err
	}

	err = seedUsersOnChats(ctx, tx)
	if err != nil {
		return err
	}

	err = seedMessages(ctx, tx)
	if err != nil {
		return err
	}

	err = seedPictures(ctx, tx)
	if err != nil {
		return err
	}

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

func deleteFileServiceStaticPictures() error {
	log.Print("seed prisma postgres - deleting file-service static pictures")

	err := os.RemoveAll(config_service.GetConfig().FileServiceStaticPath)
	if err != nil {
		return err
	}

	err = os.MkdirAll(config_service.GetConfig().FileServiceStaticPath, 0644)
	if err != nil {
		return err
	}

	return nil
}
