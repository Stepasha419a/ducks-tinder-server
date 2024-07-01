package login

import (
	"auth-service/internal/application/mapper"
	repository "auth-service/internal/domain/repository"
	crypto_service "auth-service/internal/domain/service/crypto"
	jwt_service "auth-service/internal/domain/service/jwt"
	config_service "auth-service/internal/infrastructure/service/config"
	"context"
	"net/http"
)

func LoginCommandHandler(ctx context.Context, command *LoginCommand, responseError func(status int, message string), authUserRepository repository.AuthUserRepository) (*mapper.AuthUserResponse, error) {
	authUser, err := authUserRepository.FindByEmail(ctx, command.Email, nil)
	if err != nil {
		return nil, err
	}

	if authUser == nil {
		responseError(http.StatusForbidden, "Incorrect email or password")
		return nil, nil
	}

	isEqual := crypto_service.Compare(command.Password, authUser.Password, []byte(config_service.GetConfig().PasswordSalt))
	if !isEqual {
		responseError(http.StatusForbidden, "Incorrect email or password")
		return nil, nil
	}

	tokens := jwt_service.GenerateTokens(authUser.Id)
	authUser.RefreshToken = &tokens.RefreshToken

	savedAuthUser, err := authUserRepository.Save(ctx, authUser, nil)
	if err != nil {
		return nil, err
	}

	return mapper.NewAuthUserResponse(savedAuthUser, tokens), nil
}
