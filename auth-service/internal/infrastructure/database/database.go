package database

import (
	config_service "auth-service/internal/infrastructure/service/config"
	tls_service "auth-service/internal/infrastructure/service/tls"
	"context"
	"fmt"
	"log/slog"
	"sync"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Postgres struct {
	Mu                sync.RWMutex
	Pool              *pgxpool.Pool
	ConnectionService *connection_service.ConnectionService
	CancelFunc        context.CancelFunc
}

func NewPostgresInstance(ctx context.Context, connectionService *connection_service.ConnectionService) (*Postgres, func()) {
	pg := &Postgres{
		ConnectionService: connectionService,
	}

	ctx, cancel := context.WithCancel(ctx)
	pg.CancelFunc = cancel

	go pg.run(ctx)
	return pg, pg.Shutdown
}
	if err != nil {
		panic(err)
	}

	pgxConfig.ConnConfig.TLSConfig = tlsConfig

	pool, err := pgxpool.NewWithConfig(context.TODO(), pgxConfig)
	if err != nil {
		panic(err)
	}

	err = pool.Ping(context.TODO())
	if err != nil {
		panic(err)
	}

	return &Postgres{pool}
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
