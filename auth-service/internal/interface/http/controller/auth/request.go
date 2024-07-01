package auth_controller

import (
	"auth-service/internal/application/command/auth/login"
	"auth-service/internal/application/command/auth/logout"
	"auth-service/internal/application/command/auth/refresh"
	"auth-service/internal/application/command/auth/register"

	"github.com/go-playground/validator/v10"
)

type RegisterDto struct {
	Email    string `json:"email" validate:"required,email,max=50"`
	Password string `json:"password" validate:"required,min=6,max=30"`
	Name     string `json:"name" validate:"required,min=2,max=14"`
}

func (dto *RegisterDto) ToRegisterCommand(validate *validator.Validate) (*register.RegisterCommand, error) {
	err := validate.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &register.RegisterCommand{
		Email:    dto.Email,
		Password: dto.Password,
		Name:     dto.Name,
	}, nil
}

type LoginDto struct {
	Email    string `json:"email" validate:"required,email,max=50"`
	Password string `json:"password" validate:"required,min=6,max=30"`
}

func (dto *LoginDto) ToLoginCommand(validate *validator.Validate) (*login.LoginCommand, error) {
	err := validate.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &login.LoginCommand{
		Email:    dto.Email,
		Password: dto.Password,
	}, nil
}

type RawRefreshDto struct {
	RefreshToken string `validate:"required,jwt"`
}

func (dto *RawRefreshDto) ToRefreshCommand(validate *validator.Validate) (*refresh.RefreshCommand, error) {
	err := validate.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &refresh.RefreshCommand{
		RefreshToken: dto.RefreshToken,
	}, nil
}

type RawLogoutDto struct {
	RefreshToken string `validate:"required,jwt"`
}

func (dto *RawLogoutDto) ToLogoutCommand(validate *validator.Validate) (*logout.LogoutCommand, error) {
	err := validate.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &logout.LogoutCommand{
		RefreshToken: dto.RefreshToken,
	}, nil
}
