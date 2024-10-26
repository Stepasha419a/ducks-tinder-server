package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	fiber_impl "{{cookiecutter.module_name}}/internal/interface/http/fiber"

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
	mainCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

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
		return fiber_impl.InitHttpListener(container.App, container.ConfigService)
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