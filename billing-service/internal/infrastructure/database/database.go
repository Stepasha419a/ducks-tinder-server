package database

import (
	config_service "billing-service/internal/domain/service/config"
	"context"
	"log"
	"sync"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresInstance struct {
	Pool *pgxpool.Pool
}

var (
	pgInstance *PostgresInstance
	pgOnce     sync.Once
)

func NewPostgresInstance(configService config_service.ConfigService) *PostgresInstance {
	pgOnce.Do(func() {
		log.Println("new database postgres instance")

		pool, err := pgxpool.New(context.TODO(), configService.GetConfig().DatabaseUrl)
		if err != nil {
			panic(err)
		}

		pgInstance = &PostgresInstance{pool}
	})

	return pgInstance
}

func (pg *PostgresInstance) Close() {
	pg.Pool.Close()
}

func Exec(pool *pgxpool.Pool, tx pgx.Tx) func(ctx context.Context, sql string, arguments ...any) (pgconn.CommandTag, error) {
	if tx != nil {
		return tx.Exec
	}

	return pool.Exec
}

func Query(pool *pgxpool.Pool, tx pgx.Tx) func(ctx context.Context, sql string, args ...any) (pgx.Rows, error) {
	if tx != nil {
		return tx.Query
	}

	return pool.Query
}

func QueryRow(pool *pgxpool.Pool, tx pgx.Tx) func(ctx context.Context, sql string, args ...any) pgx.Row {
	if tx != nil {
		return tx.QueryRow
	}

	return pool.QueryRow
}
