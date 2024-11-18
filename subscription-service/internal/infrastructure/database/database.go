package database

import (
	"context"
	"log"
	"sync"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"

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

func NewPostgresInstance(configService config_service.ConfigService) (*PostgresInstance, func()) {
	pgOnce.Do(func() {
		log.Println("new database postgres instance")

		pool, err := pgxpool.New(context.TODO(), configService.GetConfig().DatabaseUrl)
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
