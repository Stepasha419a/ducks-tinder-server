package repository

import (
	entity "auth-service/internal/domain/entity"
	domain "auth-service/internal/domain/repository"
	database "auth-service/internal/infrastructure/database"
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type authUserRepository struct {
	pool *pgxpool.Pool
}

func (r *authUserRepository) Save(ctx context.Context, authUser *entity.AuthUser, tx pgx.Tx) (*entity.AuthUser, error) {
	storedAuthUser, err := r.Find(ctx, authUser.Id, tx)
	if err != nil {
		return nil, err
	}

	if storedAuthUser != nil {
		_, err := database.Exec(r.pool, tx)(ctx, "UPDATE auth_users SET email=@email, password=@password, refreshToken=@refreshToken, updatedAt=@updatedAt WHERE id=@id", &pgx.NamedArgs{
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

	_, err = database.Exec(r.pool, tx)(ctx, "INSERT INTO auth_users(id, email, password, refreshToken, updatedAt, createdAt) VALUES (@id, @email, @password, @refreshToken, @updatedAt, @createdAt)", &pgx.NamedArgs{
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

func (r *authUserRepository) Find(ctx context.Context, id string, tx pgx.Tx) (*entity.AuthUser, error) {
	authUser := &entity.AuthUser{}
	err := database.QueryRow(r.pool, tx)(ctx, "SELECT * FROM auth_users WHERE id=@id", pgx.NamedArgs{
		"id": id,
	}).Scan(authUser)

	if err != nil {
		return nil, HandleError(err)
	}

	return authUser, nil
}

func (r *authUserRepository) FindByEmail(ctx context.Context, email string, tx pgx.Tx) (*entity.AuthUser, error) {
	authUser := entity.AuthUser{}
	err := database.QueryRow(r.pool, tx)(ctx, "SELECT * FROM auth_users WHERE email=@email", pgx.NamedArgs{
		"email": email,
	}).Scan(&authUser.Id, &authUser.Email, &authUser.Password, &authUser.RefreshToken, &authUser.CreatedAt, &authUser.UpdatedAt)

	if err != nil {
		return nil, HandleError(err)
	}

	return &authUser, nil
}

func NewAuthUserRepository(pool *pgxpool.Pool) domain.AuthUserRepository {
	return &authUserRepository{pool}
}

func HandleError(err error) error {
	if err == pgx.ErrNoRows {
		return nil
	}
	return nil
}
