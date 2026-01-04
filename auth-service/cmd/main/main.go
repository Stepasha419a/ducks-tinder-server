package main

import (
	"auth-service/internal/application/facade"
	"auth-service/internal/application/service"
	connection_service "auth-service/internal/domain/service/connection"
	"auth-service/internal/infrastructure/database"
	repository_impl "auth-service/internal/infrastructure/repository"
	config_service "auth-service/internal/infrastructure/service/config"
	"auth-service/internal/infrastructure/service/user_service_impl"
	auth_controller "auth-service/internal/interface/http/controller/auth"
	health_controller "auth-service/internal/interface/http/controller/health"
	metrics_controller "auth-service/internal/interface/http/controller/metrics"
	gin_impl "auth-service/internal/interface/http/gin"
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"log/slog"

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

	httpGin := gin_impl.NewGin(int(config_service.GetConfig().Port), "main", connectionService)
	healthGin := gin_impl.NewGin(int(config_service.GetConfig().HealthPort), "health", connectionService)

	auth_controller.NewAuthController(httpGin.Engine, authFacade)

	metrics_controller.NewMetricsController(healthGin.Engine)
	health_controller.NewHealthController(healthGin.Engine, connectionService)

	cleaner := func() {
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		httpGin.Shutdown(shutdownCtx)
		healthGin.Shutdown(shutdownCtx)

		cleanupGrpc()
		cleanupDb()
	}

	setUpWithGracefulShutdown(authFacade, httpGin, healthGin, cleaner)
}

func setUpWithGracefulShutdown(authFacade service.AuthService, httpGin *gin_impl.GinImpl, healthGin *gin_impl.GinImpl, cleaner func()) {
	mainCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	g, gCtx := errgroup.WithContext(mainCtx)

	initListeners(g, httpGin, healthGin)
	gracefulShutdown(gCtx, g, cleaner)

	err := g.Wait()
	if err != nil {
		slog.Error("Starting error:", slog.Any("err", err))
	}
}

func initListeners(g *errgroup.Group, httpGin *gin_impl.GinImpl, healthGin *gin_impl.GinImpl) {
	g.Go(func() error {
		return httpGin.ListenAndServeTLS()
	})
	g.Go(func() error {
		return healthGin.ListenAndServeTLS()
	})
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
