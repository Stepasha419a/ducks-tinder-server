package refresh

import (
	"auth-service/internal/application/mapper"
	repository "auth-service/internal/domain/repository"
	jwt_service "auth-service/internal/domain/service/jwt"
	"context"
	"net/http"
)

func RefreshCommandHandler(ctx context.Context, command *RefreshCommand, responseError func(status int, message string), authUserRepository repository.AuthUserRepository) (*mapper.AuthUserResponse, error) {
	authUser, err := authUserRepository.FindByRefreshToken(ctx, command.RefreshToken, nil)
	if err != nil {
		return nil, err
	}

	if authUser == nil {
		responseError(http.StatusUnauthorized, "Unauthorized")
		return nil, nil
	}

	tokens := jwt_service.GenerateTokens(authUser.Id)
	authUser.RefreshToken = &tokens.RefreshToken

	_, err = authUserRepository.Save(ctx, authUser, nil)
	if err != nil {
		return nil, err
	}

	return mapper.NewAuthUserResponse(authUser, tokens), nil
}
