package domain

import (
	crypto_service "auth-service/internal/domain/service/crypto"
	config_service "auth-service/internal/infrastructure/service/config"
	"time"

	"github.com/google/uuid"
)

type AuthUser struct {
	Id           string
	Email        string
	Password     string
	RefreshToken *string

	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewAuthUser(email string, password string) *AuthUser {
	hashedPassword := crypto_service.Hash(password, []byte(config_service.GetConfig().PasswordSalt))

	return &AuthUser{
		Id:           uuid.New().String(),
		Email:        email,
		Password:     hashedPassword,
		RefreshToken: nil,

		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}
