package service

import (
	"auth-service/internal/application/command/auth/login"
	"auth-service/internal/application/command/auth/register"
	"auth-service/internal/application/mapper"
	"context"
)

type (
	ResponseError func(status int, message string)

	AuthService interface {
		Register(ctx context.Context, command *register.RegisterCommand, responseError ResponseError) (*mapper.AuthUserResponse, error)
		Login(ctx context.Context, command *login.LoginCommand, responseError ResponseError) (*mapper.AuthUserResponse, error)
	}
)