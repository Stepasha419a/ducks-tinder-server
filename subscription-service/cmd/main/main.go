package main

import (
	"context"
	"log"

	grpc_interface "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc"
	fiber_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/fiber"

	"golang.org/x/sync/errgroup"
)

func main() {
	container, cleaner, err := newContainer()
	if err != nil {
		panic(err)
	}

	setUpWithGracefulShutdown(container, cleaner)
}

func setUpWithGracefulShutdown(container *Container, cleaner func()) {
	mainCtx := container.Context

	g, gCtx := errgroup.WithContext(mainCtx)

	initListeners(g, container)
	gracefulShutdown(gCtx, g, cleaner)

	err := g.Wait()
	if err != nil {
		log.Printf("error: %s \n", err)
	}
}

func initListeners(g *errgroup.Group, container *Container) {
	g.Go(func() error {
		return fiber_impl.InitHttpListener(container.App, container.ConfigService, container.TlsService)
	})
	g.Go(func() error {
		return grpc_interface.InitGrpcListener(container.GrpcServer, container.ConfigService)
	})
}

func gracefulShutdown(gCtx context.Context, g *errgroup.Group, cleaner func()) {
	g.Go(func() error {
		<-gCtx.Done()

		log.Println("start graceful shutdown")
		cleaner()
		log.Println("finish graceful shutdown")

		return nil
	})
}
