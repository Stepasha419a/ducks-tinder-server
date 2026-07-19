package repository_impl

import (
	entity "billing-service/internal/domain/entity"
	repository "billing-service/internal/domain/repository"
	"billing-service/internal/infrastructure/database"
	"context"

	"github.com/jackc/pgx/v5"
)

type BillingRepositoryImpl struct {
	pg *database.Postgres
}

var _ repository.BillingRepository = (*BillingRepositoryImpl)(nil)

func NewBillingRepository(pg *database.Postgres) *BillingRepositoryImpl {
	return &BillingRepositoryImpl{pg}
}

func (r *BillingRepositoryImpl) SavePurchase(ctx context.Context, purchase *entity.Purchase, tx pgx.Tx) (*entity.Purchase, error) {
	existingPurchase, err := r.FindPurchase(ctx, purchase.Id, tx)
	if err != nil {
		return nil, err
	}

	if existingPurchase != nil {
		_, err = r.pg.Exec(tx)(ctx, "UPDATE purchases SET user_id=@user_id, amount=@amount, created_at=@created_at WHERE id=@id", &pgx.NamedArgs{
			"user_id":    purchase.UserId,
			"amount":     purchase.Amount,
			"created_at": purchase.CreatedAt,
		})
		if err != nil {
			return nil, err
		}
		return purchase, nil
	}

	_, err = r.pg.Exec(tx)(ctx, "INSERT INTO purchases (id, user_id, amount, created_at) VALUES (@id, @user_id, @amount, @created_at)", &pgx.NamedArgs{
		"id":         purchase.Id,
		"user_id":    purchase.UserId,
		"amount":     purchase.Amount,
		"created_at": purchase.CreatedAt,
	})
	if err != nil {
		return nil, err
	}

	return purchase, nil
}

func (r *BillingRepositoryImpl) FindPurchase(ctx context.Context, id string, tx pgx.Tx) (*entity.Purchase, error) {
	purchase := &entity.Purchase{}

	err := r.pg.QueryRow(tx)(ctx, "SELECT id, user_id, amount, created_at FROM purchases WHERE id=@id", &pgx.NamedArgs{
		"id": id,
	}).Scan(&purchase.Id, &purchase.UserId, &purchase.Amount, &purchase.CreatedAt)
	if err != nil {
		return nil, handleError(err)
	}

	return purchase, nil
}

func handleError(err error) error {
	if err == pgx.ErrNoRows {
		return nil
	}
	return err
}
