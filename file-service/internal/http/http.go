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
