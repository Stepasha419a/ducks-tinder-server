package http_service

import (
	"context"
	"fmt"
	tls_service "go-file-server/internal/service/tls"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type HttpService struct {
	server *http.Server
	port   int
	name   string
}

func NewHttpService(port int, name string, router *mux.Router) *HttpService {
	server := &http.Server{
		Addr:      fmt.Sprintf("0.0.0.0:%d", port),
		Handler:   router,
		TLSConfig: tls_service.GetConfig(),
	}

	return &HttpService{server, port, name}
}

func (hs *HttpService) ListenAndServeTLS() error {
	log.Printf("serving %s server on HTTPS port: %v\n", hs.name, hs.port)

	err := hs.server.ListenAndServeTLS("", "")
	if err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("http %s server error: %w", hs.name, err)
	}

	return nil
}

func (hs *HttpService) Shutdown(ctx context.Context) error {
	err := hs.server.Shutdown(ctx)

	if err != nil {
		return err
	}

	log.Printf("HTTPS %s server stopped gracefully", hs.name)
	return nil
}
