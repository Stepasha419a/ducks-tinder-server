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
	health_controller "auth-service/internal/interface/http/controller/health"
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

func setUpWithGracefulShutdown(authFacade service.AuthService, connectionService *connection_service.ConnectionService, cleaner func()) {
	mainCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	g, gCtx := errgroup.WithContext(mainCtx)

	initListeners(g, authFacade, connectionService)
	gracefulShutdown(gCtx, g, cleaner)

	err := g.Wait()
	if err != nil {
		slog.Error("Starting error:", slog.Any("err", err))
	}
}

func initListeners(g *errgroup.Group, authFacade service.AuthService, connectionService *connection_service.ConnectionService) {
	g.Go(func() error {
		return initHttpListener(authFacade, connectionService)
	})
}

func initHttpListener(authFacade service.AuthService, connectionService *connection_service.ConnectionService) error {
	e := gin.Default()

	e.Use(middleware.Cors)

	auth_controller.NewAuthController(e, authFacade)
	metrics_controller.NewMetricsController(e)
	health_controller.NewHealthController(e, connectionService)

	tlsConfig := tls_service.GetConfig()

	server := &http.Server{
		Addr:      "0.0.0.0:" + strconv.Itoa(int(config_service.GetConfig().Port)),
		Handler:   e,
		TLSConfig: tlsConfig,
	}

	err := server.ListenAndServeTLS("", "")
	if err != nil {
		return err
	}

	return nil
}

func gracefulShutdown(gCtx context.Context, g *errgroup.Group, cleaner func()) {
	g.Go(func() error {
		<-gCtx.Done()

		slog.Info("Start graceful shutdown")
		cleaner()
		slog.Info("Finish graceful shutdown")

		return nil
	})
}
