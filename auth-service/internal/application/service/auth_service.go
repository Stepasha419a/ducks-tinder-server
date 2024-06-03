package service

import (
	"auth-service/internal/application/command/auth/register"
	"auth-service/internal/application/mapper"
)

type (
	ResponseError func(status int, message string)

	AuthService interface {
		Register(command *register.RegisterCommand, responseError ResponseError) (*mapper.AuthUserResponse, error)
	}
)
