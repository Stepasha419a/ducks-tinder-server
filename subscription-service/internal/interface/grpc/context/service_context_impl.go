package grpc_context_impl

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	InternalServerError = "Internal server error"
	BadRequest          = "Bad request"
	Unauthorized        = "Unauthorized"
	NotFound            = "Not found"
	Unimplemented       = "Unimplemented"
	Conflict            = "Conflict"
)

type ServiceContextImpl[R any] struct {
	ctx            context.Context
	ResponseData   R
	ResponseStatus int
}

func NewServiceContext[R any](ctx context.Context) *ServiceContextImpl[R] {
	return &ServiceContextImpl[R]{ctx: ctx}
}

func (s *ServiceContextImpl[R]) Context() context.Context {
	return s.ctx
}

func (s *ServiceContextImpl[R]) Response(status int, body R) error {
	s.ResponseData = body
	s.ResponseStatus = status

	return nil
}

func (s *ServiceContextImpl[R]) ErrorMessage(statusCode int, message string) error {
	return status.Error(codes.Code(statusCode), message)
}

func (s *ServiceContextImpl[R]) BadRequest() error {
	return status.Error(codes.InvalidArgument, BadRequest)
}

func (s *ServiceContextImpl[R]) Unauthorized() error {
	return status.Error(codes.Unauthenticated, Unauthorized)
}

func (s *ServiceContextImpl[R]) NotFound() error {
	return status.Error(codes.NotFound, NotFound)
}

func (s *ServiceContextImpl[R]) MethodNotAllowed() error {
	return status.Error(codes.Unimplemented, Unimplemented)
}

func (s *ServiceContextImpl[R]) Conflict() error {
	return status.Error(codes.AlreadyExists, Conflict)
}

func (s *ServiceContextImpl[R]) InternalServerError() error {
	return status.Error(codes.Internal, InternalServerError)
}
