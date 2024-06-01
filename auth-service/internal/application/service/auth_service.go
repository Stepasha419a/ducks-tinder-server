package service

import (
	"auth-service/internal/application/command/auth/register"
	"auth-service/internal/application/mapper"
)

type (
	AuthService interface {
		Register(command *register.RegisterCommand) (*mapper.AuthUserResponse, error)
	}
)
