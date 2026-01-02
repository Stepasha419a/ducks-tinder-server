package grpc_client_service

import (
	"sync/atomic"
	"time"

	connection_service "auth-service/internal/domain/service/connection"

	"google.golang.org/grpc"
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

func NewGrpcClientService(ctx context.Context, connectionService *connection_service.ConnectionService, options *GrpcClientServiceOptions) (*GrpcClientService, func()) {
	tlsConfig := tls_service.GetConfig(&options.TlsServerName)

	tlsConfig.ClientAuth = tls.RequireAndVerifyClientCert
	creds := credentials.NewTLS(tlsConfig)

	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(creds),

		grpc.WithKeepaliveParams(kacp),
	}

	conn, err := grpc.NewClient(options.TargetUrl, opts...)
	if err != nil {
		slog.Error("gRPC service creation failed", slog.Any("err", err),
			slog.String("service", options.DisplayName))

		panic(err)
	}

	service := &GrpcClientService{
		Conn:              conn,
		connectionService: connectionService,
		options:           options,
	}

	go service.monitorConnectionState(ctx)
}
