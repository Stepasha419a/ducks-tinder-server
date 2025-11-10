package http_service

import (
	"context"
	"fmt"
	config_service "go-file-server/internal/service/config"
	tls_service "go-file-server/internal/service/tls"
	"log"
	"net/http"
)

type HttpService struct {
	server *http.Server
}

func NewHttpService() *HttpService {
	server := &http.Server{
		Addr:      fmt.Sprintf("0.0.0.0:%d", config_service.GetConfig().Port),
		Handler:   InitRouter(),
		TLSConfig: tls_service.GetConfig(),
	}

	return &HttpService{server}
}

func (hs *HttpService) ListenAndServeTLS() error {
	err := hs.server.ListenAndServeTLS("", "")
	if err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("http server error: %w", err)
	}

	log.Printf("serving on HTTPS port: %v\n", config_service.GetConfig().Port)

	return nil
}

func (hs *HttpService) Shutdown(ctx context.Context) error {
	err := hs.server.Shutdown(ctx)

	if err != nil {
		return err
	}

	log.Println("HTTPS server stopped gracefully")
	return nil
}
