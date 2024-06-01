package controller

import (
	"auth-service/internal/application/command/auth/register"

	"github.com/go-playground/validator/v10"
)

type RegisterDto struct {
	Email    string `json:"email" validate:"required,email,max=50"`
	Password string `json:"password" validate:"required,min=6,max=30"`
}

func (dto *RegisterDto) ToRegisterCommand(validate *validator.Validate) (*register.RegisterCommand, error) {
	err := validate.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &register.RegisterCommand{
		Email:    dto.Email,
		Password: dto.Password,
	}, nil
}
