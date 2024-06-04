package database

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type (
	TransactionService struct {
		pool *pgxpool.Pool
	}

	Transaction struct {
		Tx pgx.Tx
	}
)

func NewTransactionService(pool *pgxpool.Pool) *TransactionService {
	return &TransactionService{pool}
}

func (ts *TransactionService) Begin(ctx context.Context) *Transaction {
	tx, err := ts.pool.Begin(ctx)

	if err != nil {
		panic(err)
	}

	return &Transaction{Tx: tx}
}

func (t *Transaction) Rollback(ctx context.Context) {
	err := t.Tx.Rollback(ctx)
	if err != nil {
		panic(err)
	}
}

func (t *Transaction) Commit(ctx context.Context) {
	err := t.Tx.Commit(ctx)
	if err != nil {
		panic(err)
	}
}
