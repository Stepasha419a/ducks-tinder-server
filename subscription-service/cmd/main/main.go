package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	grpc_interface "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc"
	fiber_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/fiber"
	"google.golang.org/grpc/keepalive"

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
}

func initListeners(g *errgroup.Group, container *Container) {
	g.Go(func() error {
		return fiber_impl.InitHttpListener(container.App, container.ConfigService, container.TlsService)
	})
}
