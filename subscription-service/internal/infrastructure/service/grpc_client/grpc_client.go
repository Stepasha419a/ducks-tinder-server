package grpc_client_service

import (
	"context"
	"crypto/tls"
	"sync/atomic"
	"time"

	connection_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/connection"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"
)

type GrpcClientService struct {
	Conn    *grpc.ClientConn
	IsReady atomic.Bool

	connectionService *connection_service.ConnectionService
	options           *GrpcClientServiceOptions
}

type GrpcClientServiceOptions struct {
	TargetUrl           string
	TlsServerName       string
	DisplayName         string
	ConnectionStateName string
}

var kacp = keepalive.ClientParameters{
	Time:                10 * time.Second,
	Timeout:             5 * time.Second,
	PermitWithoutStream: true,
}

func NewGrpcClientService(ctx context.Context, tlsService *tls_service.TlsService, connectionService *connection_service.ConnectionService, options *GrpcClientServiceOptions) (*GrpcClientService, func()) {
	tlsConfig := tlsService.GetConfig(options.TlsServerName)

	tlsConfig.ClientAuth = tls.RequireAndVerifyClientCert
	creds := credentials.NewTLS(tlsConfig)

	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(creds),

		grpc.WithKeepaliveParams(kacp),
	}
}
