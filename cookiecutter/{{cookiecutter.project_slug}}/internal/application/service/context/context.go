package service_context

import "context"

type ServiceContext[R any] interface {
	Response(status int, body R) error
	Context() context.Context

	BadRequest() error
	Unauthorized() error
	NotFound() error
	MethodNotAllowed() error
	InternalServerError() error
}
