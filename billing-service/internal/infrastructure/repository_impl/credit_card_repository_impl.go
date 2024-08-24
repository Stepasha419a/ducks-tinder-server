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

func handleError(err error) error {
	if err == pgx.ErrNoRows {
		return nil
	}
	return err
}
