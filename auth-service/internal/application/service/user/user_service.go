package user_service

import (
	"context"
)

type (
	UserService interface {
		CreateUser(ctx context.Context, request *CreateUserRequest) error
	}

	CreateUserRequest struct {
		Id   string
		Name string
	}
)
