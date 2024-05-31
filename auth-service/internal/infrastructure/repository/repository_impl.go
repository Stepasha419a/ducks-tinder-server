package repository

import (
	entity "auth-service/internal/domain/entity"
	domain "auth-service/internal/domain/repository"
	database "auth-service/internal/infrastructure/database"
	"context"

	"github.com/jackc/pgx/v5"
)

type authUserRepository struct {
	pool *database.Postgres
}

func (r *authUserRepository) Save(authUser *entity.AuthUser) (*entity.AuthUser, error) {
	storedAuthUser, err := r.Find(authUser.Id)
	if err != nil {
		return nil, err
	}

	if storedAuthUser != nil {
		_, err := r.pool.Db.Exec(context.TODO(), "UPDATE auth_users SET email=@email, password=@password, refreshToken=@refreshToken, updatedAt=@updatedAt WHERE id=@id", pgx.NamedArgs{
			"email":        authUser.Email,
			"password":     authUser.Password,
			"refreshToken": authUser.RefreshToken,
			"id":           authUser.Id,
			"updatedAt":    authUser.UpdatedAt,
		})
		if err != nil {
			return nil, err
		}
		return authUser, nil
	}

	_, err = r.pool.Db.Exec(context.TODO(), "INSERT INTO auth_users(id, email, password, refreshToken, updatedAt, createdAt) VALUES (@id, @email, @password, @refreshToken, @updatedAt, @createdAt)", pgx.NamedArgs{
		"id":           authUser.Id,
		"email":        authUser.Email,
		"password":     authUser.Password,
		"refreshToken": authUser.RefreshToken,
		"updatedAt":    authUser.UpdatedAt,
		"createdAt":    authUser.CreatedAt,
	})
	if err != nil {
		return nil, err
	}

	return authUser, nil
}

func (r *authUserRepository) Find(id string) (*entity.AuthUser, error) {
	authUser := &entity.AuthUser{}
	err := r.pool.Db.QueryRow(context.TODO(), "SELECT * FROM auth_users WHERE id=@id", pgx.NamedArgs{
		"id": id,
	}).Scan(authUser)

	if err != nil {
		return nil, err
	}

	return authUser, nil
}

func (r *authUserRepository) FindByEmail(email string) (*entity.AuthUser, error) {
	authUser := &entity.AuthUser{}
	err := r.pool.Db.QueryRow(context.TODO(), "SELECT * FROM auth_users WHERE email=@email", pgx.NamedArgs{
		"email": email,
	}).Scan(authUser)

	if err != nil {
		return nil, err
	}

	return authUser, nil
}

func NewAuthUserRepository(pool *database.Postgres) domain.AuthUserRepository {
	return &authUserRepository{pool}
}
