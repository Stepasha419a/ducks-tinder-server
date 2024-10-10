package repository

import (
	entity "{{cookiecutter.module_name}}/internal/domain/entity"
	"context"

	pgx "github.com/jackc/pgx/v5"
)

type {{cookiecutter.__entity_repository}} interface {
	Save(ctx context.Context, {{ cookiecutter.__entity_low_camel_case }} *entity.{{cookiecutter.__entity_camel_case}}, tx pgx.Tx) (*entity.{{cookiecutter.__entity_camel_case}}, error)
	Find(ctx context.Context, id string, tx pgx.Tx) (*entity.{{cookiecutter.__entity_camel_case}}, error)
	Delete(ctx context.Context, id string, tx pgx.Tx) error
}
