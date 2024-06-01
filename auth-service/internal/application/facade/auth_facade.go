package facade

import (
	register "auth-service/internal/application/command/auth/register"
	"auth-service/internal/application/mapper"
	service "auth-service/internal/application/service"
	domain "auth-service/internal/domain/repository"
)

type AuthFacade struct {
	AuthUserRepository domain.AuthUserRepository
}

func (f *AuthFacade) Register(command *register.RegisterCommand) (*mapper.AuthUserResponse, error) {
	return register.RegisterCommandHandler(command, f.AuthUserRepository)
}

func NewAuthFacade(authUserRepository domain.AuthUserRepository) service.AuthService {
	return &AuthFacade{
		AuthUserRepository: authUserRepository,
	}
}
