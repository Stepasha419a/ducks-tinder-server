package facade

import (
	"auth-service/internal/application/command/auth/login"
	"auth-service/internal/application/command/auth/logout"
	"auth-service/internal/application/command/auth/refresh"
	register "auth-service/internal/application/command/auth/register"
	"auth-service/internal/application/mapper"
	service "auth-service/internal/application/service"
	user_service "auth-service/internal/application/service/user"
	domain "auth-service/internal/domain/repository"
	"auth-service/internal/infrastructure/database"
	"context"
)

type AuthFacade struct {
	authUserRepository domain.AuthUserRepository
	userService        user_service.UserService
	transactionService *database.TransactionService
}

func (f *AuthFacade) Register(ctx context.Context, command *register.RegisterCommand, responseError service.ResponseError) (*mapper.AuthUserResponse, error) {
	return register.RegisterCommandHandler(ctx, command, responseError, f.authUserRepository, f.transactionService, f.userService)
}

func (f *AuthFacade) Login(ctx context.Context, command *login.LoginCommand, responseError service.ResponseError) (*mapper.AuthUserResponse, error) {
	return login.LoginCommandHandler(ctx, command, responseError, f.authUserRepository)
}

func (f *AuthFacade) Refresh(ctx context.Context, command *refresh.RefreshCommand, responseError service.ResponseError) (*mapper.AuthUserResponse, error) {
	return refresh.RefreshCommandHandler(ctx, command, responseError, f.authUserRepository)
}

func (f *AuthFacade) Logout(ctx context.Context, command *logout.LogoutCommand, responseError service.ResponseError) (bool, error) {
	return logout.LogoutCommandHandler(ctx, command, responseError, f.authUserRepository)
}

func NewAuthFacade(authUserRepository domain.AuthUserRepository, userService user_service.UserService, transactionService *database.TransactionService) service.AuthService {
	return &AuthFacade{
		authUserRepository,
		userService,
		transactionService,
	}
}
