package main

import (
	"auth-service/internal/application/facade"
	broker_service "auth-service/internal/domain/service/broker"
	"auth-service/internal/infrastructure/adapter"
	"auth-service/internal/infrastructure/database"
	"auth-service/internal/infrastructure/repository"
	"auth-service/internal/interface/http/controller"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		panic("Error loading .env file")
	}

	db := database.NewPostgresInstance()
	transactionService := database.NewTransactionService(db.Pool)

	brokerConn := broker_service.InitBroker()

	userService := adapter.NewUserService(brokerConn)

	authUserRepository := repository.NewAuthUserRepository(db.Pool)

	authFacade := facade.NewAuthFacade(authUserRepository, userService, transactionService)

	e := gin.Default()

	controller.NewAuthController(e, authFacade)

	PORT := os.Getenv("PORT")
	http.ListenAndServe("127.0.0.1:"+PORT, e)
}
