package register

import (
	"auth-service/internal/application/mapper"
	entity "auth-service/internal/domain/entity"
	repository "auth-service/internal/domain/repository"
	jwt_service "auth-service/internal/domain/service/jwt"
	"errors"
)

func RegisterCommandHandler(command *RegisterCommand, authUserRepository repository.AuthUserRepository) (*mapper.AuthUserResponse, error) {
	candidate, err := authUserRepository.FindByEmail(command.Email)
	if err != nil {
		return nil, err
	}

	if candidate != nil {
		return nil, errors.New("email is used")
	}

	authUser := entity.NewAuthUser(command.Email, command.Password)

	tokens := jwt_service.GenerateTokens(authUser.Id)
	authUser.RefreshToken = tokens.RefreshToken

	savedAuthUser, err := authUserRepository.Save(authUser)
	if err != nil {
		return nil, err
	}

	return mapper.NewAuthUserResponse(savedAuthUser, tokens.AccessToken), nil
}
