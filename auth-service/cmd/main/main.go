package main

import (
	"auth-service/internal/application/facade"
	broker_service "auth-service/internal/domain/service/broker"
	"auth-service/internal/infrastructure/adapter"
	"auth-service/internal/infrastructure/database"
	repository_impl "auth-service/internal/infrastructure/repository"
	config_service "auth-service/internal/infrastructure/service/config"
	tls_service "auth-service/internal/infrastructure/service/tls"
	auth_controller "auth-service/internal/interface/http/controller/auth"
	metrics_controller "auth-service/internal/interface/http/controller/metrics"
	"auth-service/internal/interface/http/middleware"
	"net/http"
	"strconv"

	log "log/slog"

	"github.com/gin-gonic/gin"
)

func main() {
	config_service.RequireConfig()

	db := database.NewPostgresInstance()
	transactionService := database.NewTransactionService(db.Pool)

	brokerConn := broker_service.InitBroker(tls_service.GetConfig())

	userService := adapter.NewUserService(brokerConn)

	authUserRepository := repository_impl.NewAuthUserRepository(db.Pool)

	authFacade := facade.NewAuthFacade(authUserRepository, userService, transactionService)

	e := gin.Default()

	e.Use(middleware.Cors)

	auth_controller.NewAuthController(e, authFacade)
	metrics_controller.NewMetricsController(e)

	tlsConfig := tls_service.GetConfig()

	server := &http.Server{
		Addr:      "0.0.0.0:" + strconv.Itoa(int(config_service.GetConfig().Port)),
		Handler:   e,
		TLSConfig: tlsConfig,
	}

	err := server.ListenAndServeTLS("", "")
	if err != nil {
		log.Error("server failed to start", log.Any("error", err))
	}
}
