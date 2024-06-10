package facade

import (
	"auth-service/internal/application/command/auth/login"
	register "auth-service/internal/application/command/auth/register"
	"auth-service/internal/application/mapper"
	service "auth-service/internal/application/service"
	domain "auth-service/internal/domain/repository"
	user_service "auth-service/internal/domain/service/user"
	"auth-service/internal/infrastructure/database"
	"context"
)

type AuthFacade struct {
	authUserRepository domain.AuthUserRepository
	userService        user_service.UserService
	transactionService *database.TransactionService
}

func (f *AuthFacade) Register(ctx context.Context, command *register.RegisterCommand, responseError service.ResponseError) (*mapper.AuthUserResponse, error) {
	return register.RegisterCommandHandler(ctx, command, responseError, f.authUserRepository, f.transactionService)
}

func (f *AuthFacade) Login(ctx context.Context, command *login.LoginCommand, responseError service.ResponseError) (*mapper.AuthUserResponse, error) {
	return login.LoginCommandHandler(ctx, command, responseError, f.authUserRepository)
}

func NewAuthFacade(authUserRepository domain.AuthUserRepository, userService user_service.UserService, transactionService *database.TransactionService) service.AuthService {
	return &AuthFacade{
		authUserRepository,
		userService,
		transactionService,
	}
}
