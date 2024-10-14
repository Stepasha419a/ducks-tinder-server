package service_context

import "context"

type ServiceContext[R any] interface {
	Response(status int, body R) error
	Context() context.Context

	BadRequest() error
	NotFound() error
	Unauthorized() error
	InternalServerError() error
}
