package repository

import (
	entity "auth-service/internal/domain/entity"
	"context"

	"github.com/jackc/pgx/v5"
)

type AuthUserRepository interface {
	Save(ctx context.Context, authUser *entity.AuthUser, tx pgx.Tx) (*entity.AuthUser, error)
	Find(ctx context.Context, id string, tx pgx.Tx) (*entity.AuthUser, error)
	FindByEmail(ctx context.Context, email string, tx pgx.Tx) (*entity.AuthUser, error)
	FindByRefreshToken(ctx context.Context, refreshToken string, tx pgx.Tx) (*entity.AuthUser, error)
}
