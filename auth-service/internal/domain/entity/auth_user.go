package domain

import (
	crypto_service "auth-service/internal/domain/service/crypto"
	"os"
	"time"

	"github.com/google/uuid"
)

type AuthUser struct {
	Id           string
	Email        string
	Password     string
	RefreshToken string

	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewAuthUser(email string, password string) *AuthUser {
	hashedPassword := crypto_service.Hash(password, []byte(os.Getenv("PASSWORD_SALT")))

	return &AuthUser{
		Id:           uuid.New().String(),
		Email:        email,
		Password:     hashedPassword,
		RefreshToken: "",

		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}
