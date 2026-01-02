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

	conn.Connect()

	for {
		state := conn.GetState()

		if state == connectivity.Ready {
			slog.Info("gRPC service connected successfully",
				slog.String("service", options.DisplayName))
			break
		}

		waitCtx, waitCancel := context.WithTimeout(context.Background(), 5*time.Second)

		changed := conn.WaitForStateChange(waitCtx, state)
		waitCancel()

		if !changed {
			slog.Error("Failed to connect to gRPC service",
				slog.String("service", options.DisplayName),
				slog.String("target", options.TargetUrl),
				slog.String("current_state", state.String()),
				slog.String("next_retry_log", "5s"),
			)
		}
	}

	return service, func() {
		slog.Info("close grpc service client",
			slog.String("service", options.DisplayName))

		if service.Conn != nil {
			service.Conn.Close()
		}
	}
}

func (c *GrpcClientService) monitorConnectionState(ctx context.Context) {
	currentState := c.Conn.GetState()

	for {
		c.handleStateChange(currentState)

		if !c.Conn.WaitForStateChange(ctx, currentState) {
			slog.Info("Stopping connection monitor (context done)",
				slog.String("service", c.options.DisplayName))
			return
		}

		currentState = c.Conn.GetState()
	}
}
}
