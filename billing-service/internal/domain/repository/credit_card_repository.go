package repository

import (
	domain "billing-service/internal/domain/entity"
	"context"

	pgx "github.com/jackc/pgx/v5"
)

type CreditCardRepository interface {
	Save(ctx context.Context, creditCard *domain.CreditCard, tx pgx.Tx) (*domain.CreditCard, error)
	SavePurchase(ctx context.Context, purchase *domain.Purchase, tx pgx.Tx) (*domain.Purchase, error)
	Find(ctx context.Context, id string, tx pgx.Tx) (*domain.CreditCard, error)
	FindByUserId(ctx context.Context, userId string, tx pgx.Tx) (*domain.CreditCard, error)
	FindPurchase(ctx context.Context, id string, tx pgx.Tx) (*domain.Purchase, error)
	FindCreditCardPurchasesAmountSum(ctx context.Context, creditCardId string, tx pgx.Tx) (*int64, error)
	Delete(ctx context.Context, id string, tx pgx.Tx) error
}
