package tls_service

import (
	config_service "auth-service/internal/infrastructure/service/config"
	"crypto/tls"
	"crypto/x509"
	"os"
	"path"

	log "log/slog"
)

func GetConfig() *tls.Config {
	certPath := path.Join("cert", config_service.GetConfig().Mode, "certificate.pem")
	privateKeyPath := path.Join("cert", config_service.GetConfig().Mode, "private-key.pem")
	caCertPath := path.Join("cert", config_service.GetConfig().Mode, "ca.crt")

	caCert, err := os.ReadFile(caCertPath)
	if err != nil {
		log.Error("failed to read CA certificate", log.Any("error", err))
	}

	caCertPool := x509.NewCertPool()
	if !caCertPool.AppendCertsFromPEM(caCert) {
		log.Error("failed to append CA certificate to pool")
	}

	tlsConfig := &tls.Config{
		ClientCAs:          caCertPool,
		ClientAuth:         tls.RequireAndVerifyClientCert,
		RootCAs:            caCertPool,
		MinVersion:         tls.VersionTLS12,
		Certificates:       make([]tls.Certificate, 1),
		InsecureSkipVerify: true,
	}

	serverCert, err := tls.LoadX509KeyPair(certPath, privateKeyPath)
	if err != nil {
		log.Error("failed to load server certificate and key", log.Any("error", err))
	}
	tlsConfig.Certificates[0] = serverCert

	return tlsConfig
}
