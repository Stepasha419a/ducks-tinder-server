package service_context

import "context"

type ServiceContext interface {
	Response(status int, body interface{}) error
	Context() context.Context
}
