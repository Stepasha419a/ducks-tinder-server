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
