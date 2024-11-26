package tls_service

import (
	"crypto/tls"
	"crypto/x509"
	"os"
	"path"

	log "log/slog"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
)

type TlsService struct {
	configService config_service.ConfigService
}

func NewTlsService(configService config_service.ConfigService) *TlsService {
	return &TlsService{configService}
}
