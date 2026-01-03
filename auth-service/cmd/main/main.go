package main

import (
	"auth-service/internal/application/facade"
	"auth-service/internal/application/service"
	connection_service "auth-service/internal/domain/service/connection"
	"auth-service/internal/infrastructure/database"
	repository_impl "auth-service/internal/infrastructure/repository"
	config_service "auth-service/internal/infrastructure/service/config"
	tls_service "auth-service/internal/infrastructure/service/tls"
	"auth-service/internal/infrastructure/service/user_service_impl"
	auth_controller "auth-service/internal/interface/http/controller/auth"
	health_controller "auth-service/internal/interface/http/controller/health"
	metrics_controller "auth-service/internal/interface/http/controller/metrics"
	"auth-service/internal/interface/http/middleware"
	"context"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"log/slog"

	"github.com/gin-gonic/gin"
	"golang.org/x/sync/errgroup"
)

func main() {
	connectionService := connection_service.NewConnectionService()

	config_service.RequireConfig()

	ctx, cancel := context.WithCancel(context.Background())

	defer cancel()

	db, cleanupDb := database.NewPostgresInstance(ctx, connectionService)
	transactionService := database.NewTransactionService(db)

	userService, cleanupGrpc := user_service_impl.NewUserServiceImpl(ctx, connectionService)

	authUserRepository := repository_impl.NewAuthUserRepository(db)

	authFacade := facade.NewAuthFacade(authUserRepository, userService, transactionService)

	cleaner := func() {
		cleanupDb()
		cleanupGrpc()
	}

	setUpWithGracefulShutdown(authFacade, connectionService, cleaner)
}

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

	tlsConfig := tls_service.GetConfig(&config_service.GetConfig().TlsServerName)

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
