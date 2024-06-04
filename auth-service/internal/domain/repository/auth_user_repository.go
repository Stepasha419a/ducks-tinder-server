package domain

import (
	entity "auth-service/internal/domain/entity"
	"context"

	"github.com/jackc/pgx/v5"
)

type AuthUserRepository interface {
	Save(ctx context.Context, authUser *entity.AuthUser, tx pgx.Tx) (*entity.AuthUser, error)
	Find(ctx context.Context, id string) (*entity.AuthUser, error)
	FindByEmail(ctx context.Context, email string) (*entity.AuthUser, error)
}
