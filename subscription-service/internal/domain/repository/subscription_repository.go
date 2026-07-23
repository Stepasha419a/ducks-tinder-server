package repository

import (
	"context"

	entity "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/entity"

	pgx "github.com/jackc/pgx/v5"
)

type SubscriptionRepository interface {
	Save(ctx context.Context, subscription *entity.Subscription, tx pgx.Tx) (*entity.Subscription, error)
	Find(ctx context.Context, userId string, tx pgx.Tx) (*entity.Subscription, error)
	FindActive(ctx context.Context, userId string, tx pgx.Tx) (*entity.Subscription, error)
	FindActiveByUserIdOrLogin(ctx context.Context, userId string, login string, tx pgx.Tx) (*entity.Subscription, error)
}
