package grpc_client_service

import (
	"sync/atomic"
	"time"

	connection_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/connection"
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
