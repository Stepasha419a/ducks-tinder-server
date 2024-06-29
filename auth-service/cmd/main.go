package main

import (
	"auth-service/internal/application/facade"
	broker_service "auth-service/internal/domain/service/broker"
	"auth-service/internal/infrastructure/adapter"
	"auth-service/internal/infrastructure/database"
	"auth-service/internal/infrastructure/repository"
	config_service "auth-service/internal/infrastructure/service/config"
	auth_controller "auth-service/internal/interface/http/controller/auth"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	config_service.RequireEnv()

	db := database.NewPostgresInstance()
	transactionService := database.NewTransactionService(db.Pool)

	brokerConn := broker_service.InitBroker()

	userService := adapter.NewUserService(brokerConn)

	authUserRepository := repository.NewAuthUserRepository(db.Pool)

	authFacade := facade.NewAuthFacade(authUserRepository, userService, transactionService)

	e := gin.Default()

	auth_controller.NewAuthController(e, authFacade)

	PORT := os.Getenv("PORT")
	http.ListenAndServe("127.0.0.1:"+PORT, e)
}