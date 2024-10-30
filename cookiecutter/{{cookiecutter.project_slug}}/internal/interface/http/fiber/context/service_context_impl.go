package fiber_impl_context

import (
	"context"
	"net/http"
	"strconv"

	service_context "{{cookiecutter.module_name}}/internal/application/service/context"

	"github.com/gofiber/fiber/v3"
)

var (
	InternalServerErrorResponse = map[string]string{"status": "500", "message": "Internal server error"}
	BadRequest                  = map[string]string{"status": "400", "message": "Bad Request"}
	UnauthorizedResponse        = map[string]string{"status": "401", "message": "Unauthorized"}
	NotFound                    = map[string]string{"status": "404", "message": "Not found"}
	MethodNotAllowed            = map[string]string{"status": "405", "message": "Method not allowed"}
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

func (s *ServiceContextImpl[R]) BadRequest() error {
	return s.ctx.Status(http.StatusBadRequest).JSON(BadRequest)
}

func (s *ServiceContextImpl[R]) Unauthorized() error {
	return s.ctx.Status(http.StatusUnauthorized).JSON(UnauthorizedResponse)
}

func (s *ServiceContextImpl[R]) NotFound() error {
	return s.ctx.Status(http.StatusNotFound).JSON(NotFound)
}

func (s *ServiceContextImpl[R]) MethodNotAllowed() error {
	return s.ctx.Status(http.StatusMethodNotAllowed).JSON(MethodNotAllowed)
}

func (s *ServiceContextImpl[R]) InternalServerError() error {
	return s.ctx.Status(http.StatusInternalServerError).JSON(InternalServerErrorResponse)
}

func MapResponse(status int, message string) map[string]interface{} {
	return map[string]interface{}{
		"status":  strconv.Itoa(status),
		"message": message,
	}
}
