package logout

import (
	"auth-service/internal/domain/repository"
	"context"
	"net/http"
)

func LogoutCommandHandler(ctx context.Context, command *LogoutCommand, responseError func(status int, message string), authUserRepository repository.AuthUserRepository) (bool, error) {
	authUser, err := authUserRepository.FindByRefreshToken(ctx, command.RefreshToken, nil)
	if err != nil {
		return false, err
	}

	if authUser == nil {
		responseError(http.StatusUnauthorized, "Unauthorized")
		return false, nil
	}
	authUser.RefreshToken = nil

	_, err = authUserRepository.Save(ctx, authUser, nil)
	if err != nil {
		return false, err
	}

	return true, nil
}
