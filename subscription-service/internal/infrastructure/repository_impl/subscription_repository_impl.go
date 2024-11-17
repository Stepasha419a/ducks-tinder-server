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

func (r *SubscriptionRepositoryImpl) Find(ctx context.Context, userId string, tx pgx.Tx) (*entity.Subscription, error) {
	subscription := &entity.Subscription{}

	err := database.QueryRow(r.pg.Pool, tx)(ctx, "SELECT user_id, subscription, login, expires_at, created_at FROM subscriptions WHERE user_id=@user_id", &pgx.NamedArgs{
		"user_id": userId,
	}).Scan(&subscription.UserId, &subscription.Subscription, &subscription.Login, &subscription.ExpiresAt, &subscription.CreatedAt)
	if err != nil {
		return nil, handleError(err)
	}

	return subscription, nil
}

func handleError(err error) error {
	if err == pgx.ErrNoRows {
		return nil
	}
	return err
}
