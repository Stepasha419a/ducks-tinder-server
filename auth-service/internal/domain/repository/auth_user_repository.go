package domain

import entity "auth-service/internal/domain/entity"

type AuthUserRepository interface {
	Save(authUser *entity.AuthUser) (*entity.AuthUser, error)
	Find(id string) (*entity.AuthUser, error)
	FindByEmail(email string) (*entity.AuthUser, error)
}
