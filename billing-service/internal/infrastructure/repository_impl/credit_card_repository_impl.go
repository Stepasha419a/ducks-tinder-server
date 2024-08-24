package repository_impl

import (
	entity "billing-service/internal/domain/entity"
	repository "billing-service/internal/domain/repository"
	"billing-service/internal/infrastructure/database"
	"context"

	"github.com/jackc/pgx/v5"
)

type CreditCardRepositoryImpl struct {
	pg *database.PostgresInstance
}

var _ repository.CreditCardRepository = (*CreditCardRepositoryImpl)(nil)

func NewCreditCardRepository(pg *database.PostgresInstance) *CreditCardRepositoryImpl {
	return &CreditCardRepositoryImpl{pg}
}

func (r *CreditCardRepositoryImpl) Find(ctx context.Context, id string, tx pgx.Tx) (*entity.CreditCard, error) {
	creditCard := &entity.CreditCard{}

	err := database.QueryRow(r.pg.Pool, tx)(ctx, "SELECT id, user_id, pan, holder, cvc, expires_at, created_at, updated_at FROM credit_cards WHERE id=@id", &pgx.NamedArgs{
		"id": id,
	}).Scan(&creditCard.Id, &creditCard.UserId, &creditCard.Pan, &creditCard.Holder, &creditCard.Cvc, &creditCard.ExpiresAt, &creditCard.CreatedAt, &creditCard.UpdatedAt)
	if err != nil {
		return nil, handleError(err)
	}

	return creditCard, nil
}

func (r *CreditCardRepositoryImpl) FindByUserId(ctx context.Context, userId string, tx pgx.Tx) (*entity.CreditCard, error) {
	creditCard := &entity.CreditCard{}

	err := database.QueryRow(r.pg.Pool, tx)(ctx, "SELECT id, user_id, pan, holder, cvc, expires_at, created_at, updated_at FROM credit_cards WHERE user_id=@user_id", &pgx.NamedArgs{
		"user_id": userId,
	}).Scan(&creditCard.Id, &creditCard.UserId, &creditCard.Pan, &creditCard.Holder, &creditCard.Cvc, &creditCard.ExpiresAt, &creditCard.CreatedAt, &creditCard.UpdatedAt)
	if err != nil {
		return nil, handleError(err)
	}

	return creditCard, nil
}

func handleError(err error) error {
	if err == pgx.ErrNoRows {
		return nil
	}
	return err
}
