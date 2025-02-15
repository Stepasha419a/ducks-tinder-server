package database

import (
	config_service "billing-service/internal/domain/service/config"
	tls_service "billing-service/internal/infrastructure/service/tls"
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresInstance struct {
	Pool *pgxpool.Pool
}

func NewPostgresInstance(configService config_service.ConfigService, tlsService *tls_service.TlsService, dbName string) (*PostgresInstance, func()) {
	log.Println("new database postgres instance")

	tlsConfig := tlsService.GetConfig()
	config := configService.GetConfig()

	// TODO: db sslmode=require
	connectionString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s", config.PostgresHost, config.PostgresPort, config.PostgresUser, config.PostgresPassword, dbName)
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
