package grpc_interceptor

import (
	jwt_service "billing-service/internal/domain/service/jwt"

	"google.golang.org/grpc"
)

type GrpcInterceptor struct {
	AuthUnaryInterceptor     grpc.UnaryServerInterceptor
	RecoveryUnaryInterceptor grpc.UnaryServerInterceptor
}

func NewInterceptor(jwtService *jwt_service.JwtService) *GrpcInterceptor {
	return &GrpcInterceptor{
		AuthUnaryInterceptor:     newAuthUnaryInterceptor(jwtService),
		RecoveryUnaryInterceptor: recoveryUnaryInterceptor,
	}
}
