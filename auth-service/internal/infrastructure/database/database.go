package database

import (
	"context"
	"os"
	"sync"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Postgres struct {
	Db *pgxpool.Pool
}

var (
	pgInstance *Postgres
	pgOnce     sync.Once
)

func NewPostgresInstance() *Postgres {
	pgOnce.Do(func() {
		db, err := pgxpool.New(context.TODO(), os.Getenv("DATABASE_URL"))
		if err != nil {
			panic(err)
		}

		pgInstance = &Postgres{db}
	})

	return pgInstance
}

func (pg *Postgres) Close() {
	pg.Db.Close()
}
