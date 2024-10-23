package repository_impl

import (
	"context"

	entity "{{cookiecutter.module_name}}/internal/domain/entity"
	repository "{{cookiecutter.module_name}}/internal/domain/repository"
	"{{cookiecutter.module_name}}/internal/infrastructure/database"

	"github.com/jackc/pgx/v5"
)

type {{cookiecutter.__entity_repository}}Impl struct {
	pg *database.PostgresInstance
}

var _ repository.{{cookiecutter.__entity_repository}} = (*{{cookiecutter.__entity_repository}}Impl)(nil)

func New{{cookiecutter.__entity_repository}}(pg *database.PostgresInstance) *{{cookiecutter.__entity_repository}}Impl {
	return &{{cookiecutter.__entity_repository}}Impl{pg}
}

func (r *{{cookiecutter.__entity_repository}}Impl) Save(ctx context.Context, {{cookiecutter.__entity_low_camel_case}} *entity.{{cookiecutter.__entity_camel_case}}, tx pgx.Tx) (*entity.{{cookiecutter.__entity_camel_case}}, error) {
	existing{{cookiecutter.__entity_camel_case}}, err := r.Find(ctx, {{cookiecutter.__entity_low_camel_case}}.Id, tx)
	if err != nil {
		return nil, err
	}

	if existing{{cookiecutter.__entity_camel_case}} != nil {
		_, err = database.Exec(r.pg.Pool, tx)(ctx, "UPDATE {{cookiecutter.entity_multiple}} SET property=@property, created_at=@created_at, updated_at=@updated_at WHERE id=@id", &pgx.NamedArgs{
			"property":   {{cookiecutter.__entity_low_camel_case}}.Property,
			"created_at": {{cookiecutter.__entity_low_camel_case}}.CreatedAt,
			"updated_at": {{cookiecutter.__entity_low_camel_case}}.UpdatedAt,
		})
		if err != nil {
			return nil, err
		}
		return {{cookiecutter.__entity_low_camel_case}}, nil
	}

	_, err = database.Exec(r.pg.Pool, tx)(ctx, "INSERT INTO {{cookiecutter.entity_multiple}} (id, property, created_at, updated_at) VALUES (@id, @property, @created_at, @updated_at)", &pgx.NamedArgs{
		"id":         {{cookiecutter.__entity_low_camel_case}}.Id,
		"property":   {{cookiecutter.__entity_low_camel_case}}.Property,
		"created_at": {{cookiecutter.__entity_low_camel_case}}.CreatedAt,
		"updated_at": {{cookiecutter.__entity_low_camel_case}}.UpdatedAt,
	})
	if err != nil {
		return nil, err
	}

	return {{cookiecutter.__entity_low_camel_case}}, nil
}

func (r *{{cookiecutter.__entity_repository}}Impl) Find(ctx context.Context, id string, tx pgx.Tx) (*entity.{{cookiecutter.__entity_camel_case}}, error) {
	{{cookiecutter.__entity_low_camel_case}} := &entity.{{cookiecutter.__entity_camel_case}}{}

	err := database.QueryRow(r.pg.Pool, tx)(ctx, "SELECT id, property, created_at, updated_at FROM {{cookiecutter.entity_multiple}} WHERE id=@id", &pgx.NamedArgs{
		"id": id,
	}).Scan(&{{cookiecutter.__entity_low_camel_case}}.Id, &{{cookiecutter.__entity_low_camel_case}}.Property, &{{cookiecutter.__entity_low_camel_case}}.CreatedAt, &{{cookiecutter.__entity_low_camel_case}}.UpdatedAt)
	if err != nil {
		return nil, handleError(err)
	}

	return {{cookiecutter.__entity_low_camel_case}}, nil
}

func (r *{{cookiecutter.__entity_repository}}Impl) Delete(ctx context.Context, id string, tx pgx.Tx) error {
	_, err := database.Exec(r.pg.Pool, tx)(ctx, "DELETE FROM {{cookiecutter.entity_multiple}} WHERE id=@id", &pgx.NamedArgs{
		"id": id,
	})
	if err != nil {
		return err
	}

	return nil
}

func handleError(err error) error {
	if err == pgx.ErrNoRows {
		return nil
	}
	return err
}
