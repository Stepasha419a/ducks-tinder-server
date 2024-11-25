package grpc_interceptor

import (
	"context"

	jwt_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/jwt"
	grpc_context_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc/context"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

func authUnaryInterceptor(ctx context.Context, req interface{}, _ *grpc.UnaryServerInfo, handler grpc.UnaryHandler, jwtService *jwt_service.JwtService) (_ interface{}, err error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		err = status.Error(codes.Unauthenticated, grpc_context_impl.Unauthorized)
		return nil, err
	}

	authorizationData := md.Get("authorization")
	if len(authorizationData) < 1 || authorizationData[0] == "null" {
		err = status.Error(codes.Unauthenticated, grpc_context_impl.Unauthorized)
		return nil, err
	}

	bearerToken := authorizationData[0]

	if bearerToken == "" || bearerToken[:6] != "Bearer" || len(bearerToken) < 7 {
		err = status.Error(codes.Unauthenticated, grpc_context_impl.Unauthorized)
		return nil, err
	}

	isValid, _ := jwtService.ValidateSubscriptionServiceToken(bearerToken[7:])
	if !isValid {
		err = status.Error(codes.Unauthenticated, grpc_context_impl.Unauthorized)
		return nil, err
	}

	return handler(ctx, req)
}
