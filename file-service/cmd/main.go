package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	grpc_service "go-file-server/internal/interface/grpc"
	http_service "go-file-server/internal/interface/http"
	config_service "go-file-server/internal/service/config"
	grpc_service "go-file-server/internal/service/grpc"
	tls_service "go-file-server/internal/service/tls"
)

func main() {
	config_service.RequireConfig()

func setUpWithGracefulShutdown() {
	mainCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	g, gCtx := errgroup.WithContext(mainCtx)
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
