package grpc_interceptor

import (
	grpc_context_impl "billing-service/internal/interface/grpc/context"
	"context"
	"log"
	"runtime/debug"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func recoveryUnaryInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (_ interface{}, err error) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("panic: `%s` %s", info.FullMethod, string(debug.Stack()))
			err = status.Error(codes.Internal, grpc_context_impl.InternalServerError)
		}
	}()
	return handler(ctx, req)
}
