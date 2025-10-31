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
func (pg *Postgres) connect() error {
	cfg := config_service.GetConfig()
	tlsConfig := tls_service.GetConfig()

	connStr := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=verify-full",
		cfg.PostgresHost,
		cfg.PostgresPort,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresDatabase,
	)

	pgxCfg, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return fmt.Errorf("Postgres parse config error: %w", err)
	}
	pgxCfg.ConnConfig.TLSConfig = tlsConfig

	pool, err := pgxpool.NewWithConfig(context.Background(), pgxCfg)
	if err != nil {
		return fmt.Errorf("Postgres new pool error: %w", err)
	}

	if err := pool.Ping(context.Background()); err != nil {
		pool.Close()
		return fmt.Errorf("Postgres ping failed error: %w", err)
	}

	pg.Mu.Lock()
	pg.Pool = pool
	pg.Mu.Unlock()

	return nil
}

func (pg *Postgres) Ping(ctx context.Context) error {
	pg.Mu.RLock()
	defer pg.Mu.RUnlock()

	if pg.Pool == nil {
		return fmt.Errorf("Postgres pool is nil")
	}

	return pg.Pool.Ping(ctx)
}

func (pg *Postgres) GetPool() (*pgxpool.Pool, error) {
	pg.Mu.RLock()
	defer pg.Mu.RUnlock()

	if pg.Pool == nil {
		return nil, fmt.Errorf("postgres pool not initialized")
	}

	return pg.Pool, nil
}

func (pg *Postgres) Close() {
	pg.Mu.Lock()
	defer pg.Mu.Unlock()

	if pg.Pool != nil {
		pg.Pool.Close()
		pg.Pool = nil

		slog.Info("Postgres connection closed")
	}
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
