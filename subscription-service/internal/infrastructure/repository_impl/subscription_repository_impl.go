package repository_impl

import (
	"context"

	entity "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/entity"
	repository "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/repository"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/database"

	"github.com/jackc/pgx/v5"
)

type SubscriptionRepositoryImpl struct {
	pg *database.Postgres
}

var _ repository.SubscriptionRepository = (*SubscriptionRepositoryImpl)(nil)

func NewSubscriptionRepository(pg *database.Postgres) *SubscriptionRepositoryImpl {
	return &SubscriptionRepositoryImpl{pg}
}

func (r *SubscriptionRepositoryImpl) Save(ctx context.Context, subscription *entity.Subscription, tx pgx.Tx) (*entity.Subscription, error) {
	existingSubscription, err := r.Find(ctx, subscription.UserId, tx)
	if err != nil {
		return nil, err
	}

	if existingSubscription != nil {
		_, err = r.pg.Exec(tx)(ctx, "UPDATE subscriptions SET subscription=@subscription, login=@login, super_likes_count=@super_likes_count, search_boosts_count=@search_boosts_count, cancelled_at=@cancelled_at, search_boost_expires_at=@search_boost_expires_at, expiresAt=@expires_at WHERE user_id=@user_id", &pgx.NamedArgs{
			"subscription":            subscription.Subscription,
			"user_id":                 subscription.UserId,
			"login":                   subscription.Login,
			"expires_at":              subscription.ExpiresAt,
			"super_likes_count":       subscription.SuperLikesCount,
			"search_boosts_count":     subscription.SearchBoostsCount,
			"cancelled_at":            subscription.CancelledAt,
			"search_boost_expires_at": subscription.SearchBoostExpiresAt,
		})
		if err != nil {
			return nil, err
		}
		return subscription, nil
	}

	_, err = r.pg.Exec(tx)(ctx, "INSERT INTO subscriptions (user_id, subscription, login, expires_at, created_at) VALUES (@user_id, @subscription, @login, @expires_at, @created_at)", &pgx.NamedArgs{
		"user_id":                 subscription.UserId,
		"subscription":            subscription.Subscription,
		"login":                   subscription.Login,
		"expires_at":              subscription.ExpiresAt,
		"created_at":              subscription.CreatedAt,
		"super_likes_count":       subscription.SuperLikesCount,
		"search_boosts_count":     subscription.SearchBoostsCount,
		"cancelled_at":            subscription.CancelledAt,
		"search_boost_expires_at": subscription.SearchBoostExpiresAt,
	})
	if err != nil {
		return nil, err
	}

	return subscription, nil
}

func (r *SubscriptionRepositoryImpl) Find(ctx context.Context, userId string, tx pgx.Tx) (*entity.Subscription, error) {
	subscription := &entity.Subscription{}

	err := r.pg.QueryRow(tx)(ctx, "SELECT user_id, subscription, login, super_likes_count, search_boosts_count, cancelled_at, search_boost_expires_at, expires_at, created_at FROM subscriptions WHERE user_id=@user_id", &pgx.NamedArgs{
		"user_id": userId,
	}).Scan(&subscription.UserId, &subscription.Subscription, &subscription.Login, &subscription.SuperLikesCount, &subscription.SearchBoostsCount, &subscription.CancelledAt, &subscription.SearchBoostExpiresAt, &subscription.ExpiresAt, &subscription.CreatedAt)
	if err != nil {
		return nil, handleError(err)
	}

	return subscription, nil
}

func (r *SubscriptionRepositoryImpl) FindActive(ctx context.Context, userId string, tx pgx.Tx) (*entity.Subscription, error) {
	subscription := &entity.Subscription{}

	err := r.pg.QueryRow(tx)(ctx, "SELECT user_id, subscription, login, super_likes_count, search_boosts_count, cancelled_at, search_boost_expires_at, expires_at, created_at FROM subscriptions WHERE user_id=@user_id AND expires_at > NOW() AND cancelled_at IS NULL", &pgx.NamedArgs{
		"user_id": userId,
	}).Scan(&subscription.UserId, &subscription.Subscription, &subscription.Login, &subscription.SuperLikesCount, &subscription.SearchBoostsCount, &subscription.CancelledAt, &subscription.SearchBoostExpiresAt, &subscription.ExpiresAt, &subscription.CreatedAt)
	if err != nil {
		return nil, handleError(err)
	}

	return subscription, nil
}

func (r *SubscriptionRepositoryImpl) FindActiveByUserIdOrLogin(ctx context.Context, userId string, login string, tx pgx.Tx) (*entity.Subscription, error) {
	subscription := &entity.Subscription{}

	err := r.pg.QueryRow(tx)(ctx, "SELECT user_id, subscription, login, super_likes_count, search_boosts_count, cancelled_at, search_boost_expires_at, expires_at, created_at FROM subscriptions WHERE (user_id=@user_id OR login=@login) AND expires_at > NOW() AND cancelled_at IS NULL", &pgx.NamedArgs{
		"user_id": userId,
		"login":   login,
	}).Scan(&subscription.UserId, &subscription.Subscription, &subscription.Login, &subscription.SuperLikesCount, &subscription.SearchBoostsCount, &subscription.CancelledAt, &subscription.SearchBoostExpiresAt, &subscription.ExpiresAt, &subscription.CreatedAt)
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
