package database

import (
	"context"

	"github.com/jackc/pgx/v5"
)

type (
	TransactionService struct {
		db *Postgres
	}

	Transaction struct {
		Tx pgx.Tx
	}
)

func NewTransactionService(db *Postgres) *TransactionService {
	return &TransactionService{db}
}

func (ts *TransactionService) Begin(ctx context.Context) *Transaction {
	pool, err := ts.db.GetPool()
	if err != nil {
		panic(err)
	}

	tx, err := pool.Begin(ctx)

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
