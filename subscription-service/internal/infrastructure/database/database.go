package database

import (
	"context"
	"fmt"
	"log"
	"sync"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"

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

func NewPostgresInstance(configService config_service.ConfigService, tlsService *tls_service.TlsService) (*PostgresInstance, func()) {
	pgOnce.Do(func() {
		log.Println("new database postgres instance")

		tlsConfig := tlsService.GetConfig()
		config := configService.GetConfig()

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

		pgInstance = &PostgresInstance{pool}
	})

	return pgInstance, cleanUp
}

func cleanUp() {
	log.Println("close database postgres instance")

	pgInstance.Pool.Close()
	pgInstance.Close()
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
