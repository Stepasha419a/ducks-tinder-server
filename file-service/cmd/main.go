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
		err := httpService.Shutdown(ctx)
		if err != nil {
			log.Printf("HTTPS shutdown error: %v", err)
		}

		grpcService.GracefulStop()
	}

	initListeners(g, httpService, grpcService)
	gracefulShutdown(gCtx, g, cleaner)

	if err := g.Wait(); err != nil {
		log.Printf("exit reason: %v", err)
	}
}

func initListeners(g *errgroup.Group, httpService *http_service.HttpService, grpcService *grpc_service.GrpcService) {
	g.Go(func() error {
		return httpService.ListenAndServeTLS()
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
