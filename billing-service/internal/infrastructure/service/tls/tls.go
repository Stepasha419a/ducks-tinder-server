package tls_service

import (
	config_service "billing-service/internal/domain/service/config"
	"crypto/tls"
	"crypto/x509"
	"os"
	"path"

	log "log/slog"
)

type TlsService struct {
	configService config_service.ConfigService
}

func NewTlsService(configService config_service.ConfigService) *TlsService {
	return &TlsService{configService}
}
