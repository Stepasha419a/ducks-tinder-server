package grpc_interceptor

import (
	"context"
	"log"
	"runtime/debug"

	grpc_context_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/grpc/context"

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
