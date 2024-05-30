package domain

import entity "auth-service/internal/domain/entity"

type Repository interface {
	Save(authUser *entity.AuthUser) (*entity.AuthUser, error)
	Find(id string) (*entity.AuthUser, error)
}
