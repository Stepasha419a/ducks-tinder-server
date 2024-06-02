package main

import (
	"auth-service/internal/application/facade"
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

	pgPool := database.NewPostgresInstance()

	authUserRepository := repository.NewAuthUserRepository(pgPool)

	authFacade := facade.NewAuthFacade(authUserRepository)

	e := gin.Default()

	controller.NewAuthController(e, authFacade)

	PORT := os.Getenv("PORT")
	http.ListenAndServe("127.0.0.1:"+PORT, e)
}
