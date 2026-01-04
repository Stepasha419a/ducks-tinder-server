package gin_impl

import (
	connection_service "auth-service/internal/domain/service/connection"
	config_service "auth-service/internal/infrastructure/service/config"
	tls_service "auth-service/internal/infrastructure/service/tls"
	"auth-service/internal/interface/http/middleware"
	"context"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type GinImpl struct {
	Engine *gin.Engine
	server *http.Server
	name   string
	port   int
}

func NewGin(port int, name string, connectionService *connection_service.ConnectionService) *GinImpl {
	e := gin.Default()

	e.Use(middleware.Cors)

	tlsConfig := tls_service.GetConfig(&config_service.GetConfig().TlsServerName)

	server := &http.Server{
		Addr:      "0.0.0.0:" + strconv.Itoa(int(port)),
		Handler:   e,
		TLSConfig: tlsConfig,
	}

	return &GinImpl{Engine: e, server: server, port: port, name: name}
}

func (g *GinImpl) ListenAndServeTLS() error {
	slog.Info("http service successfully listens to",
		slog.String("service", g.name), slog.Int("port", g.port))

	return g.server.ListenAndServeTLS("", "")
}

func (g *GinImpl) Shutdown(ctx context.Context) error {
	slog.Info("http service shutdown ",
		slog.String("service", g.name), slog.Int("port", g.port))

	return g.server.Shutdown(ctx)
}
