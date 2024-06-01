package register

import (
	"auth-service/internal/application/mapper"
	entity "auth-service/internal/domain/entity"
	repository "auth-service/internal/domain/repository"
	jwt_service "auth-service/internal/domain/service/jwt"
	"net/http"
)

func RegisterCommandHandler(command *RegisterCommand, responseError func(status int, message string), authUserRepository repository.AuthUserRepository) (*mapper.AuthUserResponse, error) {
	candidate, err := authUserRepository.FindByEmail(command.Email)
	if err != nil {
		return nil, err
	}

	if candidate != nil {
		responseError(http.StatusBadRequest, "user already exists")
		return nil, nil
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
