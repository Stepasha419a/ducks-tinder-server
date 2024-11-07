package main

import (
	"auth-service/internal/application/facade"
	broker_service "auth-service/internal/domain/service/broker"
	"auth-service/internal/infrastructure/adapter"
	"auth-service/internal/infrastructure/database"
	repository_impl "auth-service/internal/infrastructure/repository"
	config_service "auth-service/internal/infrastructure/service/config"
	auth_controller "auth-service/internal/interface/http/controller/auth"
	metrics_controller "auth-service/internal/interface/http/controller/metrics"
	"auth-service/internal/interface/http/middleware"
	"net/http"
	"path"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	config_service.RequireConfig()

	db := database.NewPostgresInstance()
	transactionService := database.NewTransactionService(db.Pool)

	brokerConn := broker_service.InitBroker()

	userService := adapter.NewUserService(brokerConn)

	authUserRepository := repository_impl.NewAuthUserRepository(db.Pool)

	authFacade := facade.NewAuthFacade(authUserRepository, userService, transactionService)

	e := gin.Default()

	e.Use(middleware.Cors)

	auth_controller.NewAuthController(e, authFacade)
	metrics_controller.NewMetricsController(e)

	certPath := path.Join("cert", config_service.GetConfig().Mode, "certificate.pem")
	privateKeyPath := path.Join("cert", config_service.GetConfig().Mode, "private-key.pem")

	http.ListenAndServeTLS("0.0.0.0:"+strconv.Itoa(int(config_service.GetConfig().Port)), certPath, privateKeyPath, e)
}
