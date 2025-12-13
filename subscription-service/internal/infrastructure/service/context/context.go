package context_service

import (
	"context"
	"os"
	"os/signal"
	"syscall"
)

func NewContext() (context.Context, func()) {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)

	return ctx, stop
}
