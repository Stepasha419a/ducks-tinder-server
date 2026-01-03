package user_service_impl

import (
	"context"

	user_service "auth-service/internal/application/service/user"
	connection_service "auth-service/internal/domain/service/connection"
	config_service "auth-service/internal/infrastructure/service/config"
	grpc_client_service "auth-service/internal/infrastructure/service/grpc_client"
	"auth-service/proto/gen"
)

var connectionServiceName = "grpc_user_service"
var displayName = "user service"

type UserServiceImpl struct {
	client  gen.UserServiceClient
	service *grpc_client_service.GrpcClientService
}

func NewUserServiceImpl(ctx context.Context, connectionService *connection_service.ConnectionService) (*UserServiceImpl, func()) {
	targetUrl := config_service.GetConfig().GrpcUserServiceUrl
	tlsServerName := config_service.GetConfig().TlsServerName

	clientService, cleanUp := grpc_client_service.NewGrpcClientService(ctx, connectionService, &grpc_client_service.GrpcClientServiceOptions{TargetUrl: targetUrl, TlsServerName: tlsServerName, DisplayName: displayName, ConnectionStateName: connectionServiceName})
	service := &UserServiceImpl{
		service: clientService,
	}

	service.client = gen.NewUserServiceClient(service.service.Conn)

	return service, cleanUp
}

func (c *UserServiceImpl) CreateUser(ctx context.Context, request *user_service.CreateUserRequest) error {
	in := &gen.CreateUserRequest{
		Id:   request.Id,
		Name: request.Name,
	}

	_, err := c.client.CreateUser(ctx, in)
	if err != nil {
		return err
	}

	return nil
}
