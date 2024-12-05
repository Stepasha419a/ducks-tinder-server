package database

import (
	config_service "auth-service/internal/infrastructure/service/config"
	tls_service "auth-service/internal/infrastructure/service/tls"
	"context"
	"fmt"
	"sync"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Postgres struct {
	Pool *pgxpool.Pool
}

var (
	pgInstance *Postgres
	pgOnce     sync.Once
)

func NewPostgresInstance() *Postgres {
	pgOnce.Do(func() {
		tlsConfig := tls_service.GetConfig()
		config := config_service.GetConfig()

		connectionString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=require", config.PostgresHost, config.PostgresPort, config.PostgresUser, config.PostgresPassword, config.PostgresDatabase)
		pgxConfig, err := pgxpool.ParseConfig(connectionString)
		if err != nil {
			panic(err)
		}

		pgxConfig.ConnConfig.TLSConfig = tlsConfig

		pool, err := pgxpool.NewWithConfig(context.TODO(), pgxConfig)
		if err != nil {
			panic(err)
		}

		pgInstance = &Postgres{pool}
	})

	return pgInstance
}

func (pg *Postgres) Close() {
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
