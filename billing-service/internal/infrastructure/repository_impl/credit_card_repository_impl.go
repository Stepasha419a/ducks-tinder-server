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

func (r *CreditCardRepositoryImpl) Save(ctx context.Context, creditCard *entity.CreditCard, tx pgx.Tx) (*entity.CreditCard, error) {
	existingCreditCard, err := r.Find(ctx, creditCard.Id, tx)
	if err != nil {
		return nil, err
	}

	if existingCreditCard != nil {
		_, err = database.Exec(r.pg.Pool, tx)(ctx, "UPDATE credit_cards SET user_id=@user_id, pan=@pan, holder=@holder, cvc=@cvc, expires_at=@expires_at, created_at=@created_at, updated_at=@updated_at WHERE id=@id", &pgx.NamedArgs{
			"user_id":    creditCard.UserId,
			"pan":        creditCard.Pan,
			"holder":     creditCard.Holder,
			"cvc":        creditCard.Cvc,
			"expires_at": creditCard.ExpiresAt,
			"created_at": creditCard.CreatedAt,
			"updated_at": creditCard.UpdatedAt,
		})
		if err != nil {
			return nil, err
		}
		return creditCard, nil
	}

	_, err = database.Exec(r.pg.Pool, tx)(ctx, "INSERT INTO credit_cards (id, user_id, pan, holder, cvc, expires_at, created_at, updated_at) VALUES (@id, @user_id, @pan, @holder, @cvc, @expires_at, @created_at, @updated_at)", &pgx.NamedArgs{
		"user_id":    creditCard.UserId,
		"pan":        creditCard.Pan,
		"holder":     creditCard.Holder,
		"cvc":        creditCard.Cvc,
		"expires_at": creditCard.ExpiresAt,
		"created_at": creditCard.CreatedAt,
		"updated_at": creditCard.UpdatedAt,
	})
	if err != nil {
		return nil, err
	}

	return creditCard, nil
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
