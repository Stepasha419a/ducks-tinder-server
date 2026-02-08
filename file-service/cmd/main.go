package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	grpc_service "go-file-server/internal/interface/grpc"
	http_service "go-file-server/internal/interface/http"
	config_service "go-file-server/internal/service/config"
	validator_service "go-file-server/internal/service/validator"

	"golang.org/x/sync/errgroup"
)

func main() {
	config_service.RequireConfig()

	validatorService := validator_service.NewValidatorService()

	setUpWithGracefulShutdown(validatorService)
}

func setUpWithGracefulShutdown(validatorService *validator_service.ValidatorService) {
	mainCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	g, gCtx := errgroup.WithContext(mainCtx)

	httpApp := http_service.NewHttpApp()
	healthApp := http_service.NewHealthApp()
	grpcService := grpc_service.NewGrpcService(validatorService)

	cleaner := func(ctx context.Context) {
		err := httpApp.Shutdown(ctx)
		if err != nil {
			log.Printf("HTTPS http shutdown error: %v", err)
		}

		err = healthApp.Shutdown(ctx)
		if err != nil {
			log.Printf("HTTPS health shutdown error: %v", err)
		}

		grpcService.GracefulStop()
	}

	initListeners(g, healthApp, httpApp, grpcService)
	gracefulShutdown(gCtx, g, cleaner)

	if err := g.Wait(); err != nil {
		log.Printf("exit reason: %v", err)
	}
}

func initListeners(g *errgroup.Group, healthApp *http_service.HttpService, httpApp *http_service.HttpService, grpcService *grpc_service.GrpcService) {
	g.Go(func() error {
		return healthApp.ListenAndServeTLS()
	})
	g.Go(func() error {
		return httpApp.ListenAndServeTLS()
	})
	g.Go(func() error {
		return grpcService.Serve()
	})
}

func gracefulShutdown(gCtx context.Context, g *errgroup.Group, cleaner func(ctx context.Context)) {
	g.Go(func() error {
		<-gCtx.Done()

		log.Println("start graceful shutdown")
		cleaner(gCtx)
		log.Println("finish graceful shutdown")

		return nil
	})
}
