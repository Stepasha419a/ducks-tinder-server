package prisma_seeder

import (
	"context"
	config_service "database-seeder/internal/service/config"
	"log"
	"os"
	"path"
	"slices"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type (
	Picture struct {
		A string `json:"A" validate:"required"`
		B string `json:"B" validate:"required"`
	}
)

func seedPictures(ctx context.Context, tx pgx.Tx) error {
	log.Print("seed prisma postgres - pictures")

	files, err := os.ReadDir(config_service.GetConfig().PicturesPath)
	if err != nil {
		log.Print("seed prisma postgres - error - no pictures dir provided, pictures are not seeded")
		return nil
	}

	if len(files) == 0 {
		log.Print("seed prisma postgres - error - no pictures provided, pictures are not seeded")
		return nil
	}

	users := getUsersSeedData()
	userIds := []string{}

	for _, user := range users {
		userIds = append(userIds, user.Id)
	}

	filenames := []string{}
	userWithPictureIds := []string{}

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		filename := strings.Split(file.Name(), ".")[0]

		if slices.Contains(userIds, filename) {
			filenames = append(filenames, filename)
			userWithPictureIds = append(userWithPictureIds, filename)
		}
	}

	if len(filenames) == 0 {
		log.Print("seed prisma postgres - error - no userId name pictures provided, pictures are not seeded")
		return nil
	}

	for i, filename := range filenames {
		fullFilename := filename + ".jpg"

		bytes, err := os.ReadFile(path.Join(config_service.GetConfig().PicturesPath, fullFilename))
		if err != nil {
			return err
		}

		copiedNewFilename := uuid.New().String() + ".jpg"
		filePath := path.Join(config_service.GetConfig().FileServiceStaticPath, copiedNewFilename)

		err = os.WriteFile(filePath, bytes, 0644)
		if err != nil {
			return err
		}

		filenames[i] = copiedNewFilename
	}

	query := `INSERT INTO pictures 
	(id, name, "order", "userId", "createdAt", "updatedAt") 
	VALUES 
	(@id, @name, @order, @userId, @createdAt, @updatedAt)`

	batch := &pgx.Batch{}

	for i := 0; i < len(filenames); i++ {
		args := pgx.NamedArgs{
			"id":        uuid.New().String(),
			"name":      filenames[i],
			"order":     0,
			"userId":    userWithPictureIds[i],
			"createdAt": time.Now().Format(time.RFC3339),
			"updatedAt": time.Now().Format(time.RFC3339),
		}

		batch.Queue(query, args)
	}

	results := tx.SendBatch(ctx, batch)
	defer results.Close()

	for range filenames {
		_, err := results.Exec()
		if err != nil {
			return err
		}
	}

	return nil
}
