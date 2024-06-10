package auth_controller

import (
	"auth-service/internal/application/mapper"
	"time"
)

type AuthUserPublicResponse struct {
	Id          string `json:"id"`
	Email       string `json:"email"`
	AccessToken string `json:"accessToken"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewAuthUserPublicResponse(res *mapper.AuthUserResponse) *AuthUserPublicResponse {
	return &AuthUserPublicResponse{
		Id:          res.Id,
		Email:       res.Email,
		AccessToken: res.AccessToken,
		CreatedAt:   res.CreatedAt,
		UpdatedAt:   res.UpdatedAt,
	}
}
