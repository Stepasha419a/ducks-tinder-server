package repository_impl

import (
	"context"

	entity "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/entity"
	repository "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/repository"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/database"

	"github.com/jackc/pgx/v5"
)

type SubscriptionRepositoryImpl struct {
	pg *database.PostgresInstance
}

var _ repository.SubscriptionRepository = (*SubscriptionRepositoryImpl)(nil)

func NewSubscriptionRepository(pg *database.PostgresInstance) *SubscriptionRepositoryImpl {
	return &SubscriptionRepositoryImpl{pg}
}

func handleError(err error) error {
	if err == pgx.ErrNoRows {
		return nil
	}
	return err
}
