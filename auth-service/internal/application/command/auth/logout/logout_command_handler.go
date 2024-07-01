package logout

import (
	"auth-service/internal/domain/repository"
	"context"
	"net/http"
)

func LogoutCommandHandler(ctx context.Context, command *LogoutCommand, responseError func(status int, message string), authUserRepository repository.AuthUserRepository) error {
	authUser, err := authUserRepository.FindByRefreshToken(ctx, command.RefreshToken, nil)
	if err != nil {
		return err
	}

	if authUser == nil {
		responseError(http.StatusUnauthorized, "Unauthorized")
		return nil
	}
	authUser.RefreshToken = nil

	_, err = authUserRepository.Save(ctx, authUser, nil)
	if err != nil {
		return err
	}

	return nil
}
