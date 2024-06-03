package facade

import (
	register "auth-service/internal/application/command/auth/register"
	"auth-service/internal/application/mapper"
	service "auth-service/internal/application/service"
	domain "auth-service/internal/domain/repository"
	user_service "auth-service/internal/domain/service/user"
)

type AuthFacade struct {
	authUserRepository domain.AuthUserRepository
	userService        user_service.UserService
}

func (f *AuthFacade) Register(command *register.RegisterCommand, responseError service.ResponseError) (*mapper.AuthUserResponse, error) {
	return register.RegisterCommandHandler(command, responseError, f.authUserRepository)
}

func NewAuthFacade(authUserRepository domain.AuthUserRepository, userService user_service.UserService) service.AuthService {
	return &AuthFacade{
		authUserRepository,
		userService,
	}
}
