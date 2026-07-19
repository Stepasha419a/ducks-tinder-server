package repository

import (
	domain "billing-service/internal/domain/entity"
	"context"

	pgx "github.com/jackc/pgx/v5"
)

type BillingRepository interface {
	SavePurchase(ctx context.Context, purchase *domain.Purchase, tx pgx.Tx) (*domain.Purchase, error)
	FindPurchase(ctx context.Context, id string, tx pgx.Tx) (*domain.Purchase, error)
}
