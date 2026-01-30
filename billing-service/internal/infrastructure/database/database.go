package database

import (
	config_service "billing-service/internal/domain/service/config"
	connection_service "billing-service/internal/domain/service/connection"
	tls_service "billing-service/internal/infrastructure/service/tls"
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

var connectionServiceName = "postgres"

type Postgres struct {
	Mu                sync.RWMutex
	Pool              *pgxpool.Pool
	ConnectionService *connection_service.ConnectionService
	CancelFunc        context.CancelFunc
}

func NewPostgresInstance(ctx context.Context, configService config_service.ConfigService, tlsService *tls_service.TlsService, connectionService *connection_service.ConnectionService) (*Postgres, func()) {
	pg := &Postgres{
		ConnectionService: connectionService,
	}

	ctx, cancel := context.WithCancel(ctx)
	pg.CancelFunc = cancel

	go pg.run(ctx, configService, tlsService)

	return pg, pg.Shutdown
}

func (pg *Postgres) run(ctx context.Context, configService config_service.ConfigService, tlsService *tls_service.TlsService) {
	for {
		if err := pg.connect(configService, tlsService); err != nil {
			log.Printf("postgres connection failed, error: %s", err)
			pg.ConnectionService.UpdateState(connectionServiceName, false, err)
			select {
			case <-time.After(5 * time.Second):
				continue
			case <-ctx.Done():
				return
			}
		}

		pg.ConnectionService.UpdateState(connectionServiceName, true, nil)
		log.Print("postgres connected successfully")

		ticker := time.NewTicker(5 * time.Second)
		for {
			select {
			case <-ticker.C:
				if err := pg.Ping(ctx); err != nil {
					log.Printf("postgres lost connection, error: %s", err)
					pg.Close()
					pg.ConnectionService.UpdateState(connectionServiceName, false, err)

					goto RECONNECT
				}
			case <-ctx.Done():
				ticker.Stop()
				pg.Close()

				return
			}
		}
	RECONNECT:
		ticker.Stop()
	}
}

func (pg *Postgres) connect(configService config_service.ConfigService, tlsService *tls_service.TlsService) error {
	cfg := configService.GetConfig()
	tlsConfig := tlsService.GetConfig(cfg.TlsServerName)

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
		return fmt.Errorf("postgres parse config error: %w", err)
	}
	pgxCfg.ConnConfig.TLSConfig = tlsConfig

	pool, err := pgxpool.NewWithConfig(context.Background(), pgxCfg)
	if err != nil {
		return fmt.Errorf("postgres new pool error: %w", err)
	}

	if err := pool.Ping(context.Background()); err != nil {
		pool.Close()
		return fmt.Errorf("postgres ping failed error: %w", err)
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
		return fmt.Errorf("postgres pool is nil")
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

		log.Printf("postgres connection closed")
	}
}

func (pg *Postgres) Shutdown() {
	if pg.CancelFunc != nil {
		pg.CancelFunc()
	}

	pg.Close()
}

func (pg *Postgres) Exec(tx pgx.Tx) func(ctx context.Context, sql string, arguments ...any) (pgconn.CommandTag, error) {
	if tx != nil {
		return tx.Exec
	}

	pool, err := pg.GetPool()
	if err != nil {
		return func(ctx context.Context, sql string, args ...any) (pgconn.CommandTag, error) {
			return pgconn.CommandTag{}, err
		}
	}

	return pool.Exec
}

func (pg *Postgres) Query(tx pgx.Tx) func(ctx context.Context, sql string, args ...any) (pgx.Rows, error) {
	if tx != nil {
		return tx.Query
	}

	pool, err := pg.GetPool()
	if err != nil {
		return func(ctx context.Context, sql string, args ...any) (pgx.Rows, error) {
			return nil, err
		}
	}

	return pool.Query
}

func (pg *Postgres) QueryRow(tx pgx.Tx) func(ctx context.Context, sql string, args ...any) pgx.Row {
	if tx != nil {
		return tx.QueryRow
	}

	pool, err := pg.GetPool()
	if err != nil {
		return func(ctx context.Context, sql string, args ...any) pgx.Row {
			return &emptyRow{err: err}
		}
	}

	return pool.QueryRow
}

type emptyRow struct {
	err error
}

func (r *emptyRow) Scan(dest ...any) error {
	return r.err
}
