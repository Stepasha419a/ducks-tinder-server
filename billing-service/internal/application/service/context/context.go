package service_context

import "context"

type ServiceContext[R any] interface {
	Response(status int, body R) error
	Context() context.Context

	BadRequest(validationError *string) error
	NotFound() error
	Unauthorized() error
	MethodNotAllowed() error
	Conflict() error

	InternalServerError() error
}
