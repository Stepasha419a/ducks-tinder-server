package register

import (
	"auth-service/internal/application/mapper"
	user_service "auth-service/internal/application/service/user"
	entity "auth-service/internal/domain/entity"
	repository "auth-service/internal/domain/repository"
	jwt_service "auth-service/internal/domain/service/jwt"
	"auth-service/internal/infrastructure/database"
	"context"
	"net/http"
)

func RegisterCommandHandler(ctx context.Context, command *RegisterCommand, responseError func(status int, message string), authUserRepository repository.AuthUserRepository, transactionService *database.TransactionService, userService user_service.UserService) (*mapper.AuthUserResponse, error) {
	tx := transactionService.Begin(ctx)

	candidate, err := authUserRepository.FindByEmail(ctx, command.Email, nil)

	defer func() {
		if err != nil {
			tx.Rollback(ctx)
		} else {
			tx.Commit(ctx)
		}
	}()

	if err != nil {
		return nil, err
	}

	if candidate != nil {
		responseError(http.StatusBadRequest, "User already exists")
		return nil, nil
	}

	authUser := entity.NewAuthUser(command.Email, command.Password)

	tokens := jwt_service.GenerateTokens(authUser.Id)
	authUser.RefreshToken = &tokens.RefreshToken

	_, err = authUserRepository.Save(ctx, authUser, tx.Tx)
	if err != nil {
		return nil, err
	}

	err = userService.CreateUser(ctx, &user_service.CreateUserRequest{Id: authUser.Id, Name: command.Name})
	if err != nil {
		return nil, err
	}

	return mapper.NewAuthUserResponse(authUser, tokens), nil
}
