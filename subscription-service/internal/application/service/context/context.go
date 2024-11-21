package service_context

import "context"

type ServiceContext[R any] interface {
	Response(status int, body R) error
	ErrorMessage(status int, message string) error
	Context() context.Context

	BadRequest() error
	Unauthorized() error
	NotFound() error
	MethodNotAllowed() error

	Conflict() error
	InternalServerError() error
}
