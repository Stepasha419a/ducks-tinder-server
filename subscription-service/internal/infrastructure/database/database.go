package database

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	connection_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/connection"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
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

	pgInstance := &PostgresInstance{pool}

	return pgInstance, pgInstance.Close
}

func (pg *PostgresInstance) Close() {
	log.Println("close database postgres instance")

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
