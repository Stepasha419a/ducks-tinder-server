package mapper

import (
	domain "auth-service/internal/domain/entity"
	jwt_service "auth-service/internal/domain/service/jwt"
	"time"
)

type AuthUserResponse struct {
	Id           string `json:"id"`
	Email        string `json:"email"`
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewAuthUserResponse(authUser *domain.AuthUser, tokens *jwt_service.Tokens) *AuthUserResponse {
	return &AuthUserResponse{
		Id:           authUser.Id,
		Email:        authUser.Email,
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,

		CreatedAt: authUser.CreatedAt,
		UpdatedAt: authUser.UpdatedAt,
	}
}
