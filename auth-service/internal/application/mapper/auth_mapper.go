package mapper

import (
	domain "auth-service/internal/domain/entity"
	"time"
)

type AuthUserResponse struct {
	Id          string
	Email       string
	AccessToken string

	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewAuthUserResponse(authUser *domain.AuthUser, accessToken string) *AuthUserResponse {
	return &AuthUserResponse{
		Id:          authUser.Id,
		Email:       authUser.Email,
		AccessToken: accessToken,
		CreatedAt:   authUser.CreatedAt,
		UpdatedAt:   authUser.UpdatedAt,
	}
}
