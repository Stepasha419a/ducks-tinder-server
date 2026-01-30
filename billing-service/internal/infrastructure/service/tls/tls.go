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

func (s *TlsService) GetConfig(serverName string) *tls.Config {
	certPath := path.Join("cert", s.configService.GetConfig().Mode, "tls.crt")
	privateKeyPath := path.Join("cert", s.configService.GetConfig().Mode, "tls.key")
	caCertPath := path.Join("cert", s.configService.GetConfig().Mode, "ca.crt")

	caCert, err := os.ReadFile(caCertPath)
	if err != nil {
		log.Error("failed to read CA certificate", log.Any("error", err))
	}

	caCertPool := x509.NewCertPool()
	if !caCertPool.AppendCertsFromPEM(caCert) {
		log.Error("failed to append CA certificate to pool")
	}

	tlsConfig := &tls.Config{
		ClientCAs:    caCertPool,
		ClientAuth:   tls.RequireAndVerifyClientCert,
		RootCAs:      caCertPool,
		MinVersion:   tls.VersionTLS12,
		Certificates: make([]tls.Certificate, 1),
		ServerName:   serverName,
	}

	serverCert, err := tls.LoadX509KeyPair(certPath, privateKeyPath)
	if err != nil {
		log.Error("failed to load server certificate and key", log.Any("error", err))
	}
	tlsConfig.Certificates[0] = serverCert

	return tlsConfig
}
