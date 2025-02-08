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

func (s *TlsService) GetConfig() *tls.Config {
	certPath := path.Join("cert", s.configService.GetConfig().Mode, "certificate.pem")
	privateKeyPath := path.Join("cert", s.configService.GetConfig().Mode, "private-key.pem")
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
		ClientCAs: caCertPool,
		// TODO: fix k8s ssl - ClientAuth: tls.RequireAndVerifyClientCert
		ClientAuth:   tls.VerifyClientCertIfGiven,
		RootCAs:      caCertPool,
		MinVersion:   tls.VersionTLS12,
		Certificates: make([]tls.Certificate, 1),
		ServerName:   s.configService.GetConfig().TlsServerName,
	}

	serverCert, err := tls.LoadX509KeyPair(certPath, privateKeyPath)
	if err != nil {
		log.Error("failed to load server certificate and key", log.Any("error", err))
	}
	tlsConfig.Certificates[0] = serverCert

	return tlsConfig
}
