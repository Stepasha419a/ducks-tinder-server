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

func NewPostgresInstance(configService config_service.ConfigService, tlsService *tls_service.TlsService, dbName string) (*PostgresInstance, func()) {
	log.Println("new database postgres instance")

	tlsConfig := tlsService.GetConfig()
	config := configService.GetConfig()

	connectionString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=verify-full", config.PostgresHost, config.PostgresPort, config.PostgresUser, config.PostgresPassword, dbName)
	pgxConfig, err := pgxpool.ParseConfig(connectionString)
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
