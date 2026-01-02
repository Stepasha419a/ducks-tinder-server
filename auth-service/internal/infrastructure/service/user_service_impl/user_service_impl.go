package user_service_impl

import (
	grpc_client_service "auth-service/internal/infrastructure/service/grpc_client"
	"auth-service/proto/gen"
)

var connectionServiceName = "grpc_user_service"
var displayName = "user service"

type UserServiceImpl struct {
	client  gen.UserServiceClient
	service *grpc_client_service.GrpcClientService
}
