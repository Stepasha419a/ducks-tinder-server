package grpc_service

import (
	"context"
	jwt_service "go-file-server/internal/service/jwt"
	"log"
	"runtime/debug"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

func RecoveryUnaryInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (_ interface{}, err error) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("panic: `%s` %s", info.FullMethod, string(debug.Stack()))
			err = status.Error(codes.Internal, "internal error")
		}
	}()
	return handler(ctx, req)
}

func AuthUnaryInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (_ interface{}, err error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		err = status.Error(codes.Unauthenticated, "unauthorized")
		return nil, err
	}

	authorizationData := md.Get("authorization")
	if len(authorizationData) < 1 || authorizationData[0] == "null" {
		err = status.Error(codes.Unauthenticated, "unauthorized")
		return nil, err
	}

	bearerToken := authorizationData[0]

	if bearerToken == "" || bearerToken[:6] != "Bearer" || len(bearerToken) < 7 {
		err = status.Error(codes.Unauthenticated, "unauthorized")
		return nil, err
	}

	isValid := jwt_service.ValidateAccessToken(bearerToken[7:])
	if !isValid {
		err = status.Error(codes.Unauthenticated, "unauthorized")
		return nil, err
	}

	return handler(ctx, req)
}
