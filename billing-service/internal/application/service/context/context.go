package service_context

import "context"

type ServiceContext[r any] interface {
	Response(status int, body r) error
	Context() context.Context

	BadRequest() error
	NotFound() error
	Unauthorized() error
	InternalServerError() error
}
