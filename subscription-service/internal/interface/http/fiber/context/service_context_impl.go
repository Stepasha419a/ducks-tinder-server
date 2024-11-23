package fiber_impl_context

import (
	"context"
	"net/http"
	"strconv"

	service_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/application/service/context"

	"github.com/gofiber/fiber/v3"
)

var (
	InternalServerErrorResponse = map[string]string{"status": "500", "message": "Internal server error"}
	BadRequest                  = map[string]string{"status": "400", "message": "Bad Request"}
	UnauthorizedResponse        = map[string]string{"status": "401", "message": "Unauthorized"}
	NotFound                    = map[string]string{"status": "404", "message": "Not found"}
	MethodNotAllowed            = map[string]string{"status": "405", "message": "Method not allowed"}
	Conflict                    = map[string]string{"status": "409", "message": "Conflict"}
)

type ServiceContextImpl[R any] struct {
	ctx          fiber.Ctx
	ResponseData R
}

func NewServiceContext[R any](ctx fiber.Ctx) service_context.ServiceContext[R] {
	return &ServiceContextImpl[R]{ctx: ctx}
}

func (s *ServiceContextImpl[R]) Context() context.Context {
	return s.ctx.Context()
}

func (s *ServiceContextImpl[R]) Response(status int, body R) error {
	s.ResponseData = body

	return s.ctx.Status(status).JSON(body)
}

func (s *ServiceContextImpl[R]) ErrorMessage(status int, message string) error {
	return s.ctx.Status(status).JSON(map[string]interface{}{
		"status":  strconv.Itoa(status),
		"message": message,
	})
}
