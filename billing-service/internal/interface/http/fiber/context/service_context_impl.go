package fiber_impl_context

import (
	service_context "billing-service/internal/application/service/context"
	"context"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v3"
)

var (
	InternalServerErrorResponse = map[string]string{"status": "500", "message": "Internal server error"}
	BadRequest                  = map[string]string{"status": "400", "message": "BadRequest"}
	UnauthorizedResponse        = map[string]string{"status": "401", "message": "Unauthorized"}
	NotFound                    = map[string]string{"status": "404", "message": "Not found"}
)

type ServiceContextImpl struct {
	ctx fiber.Ctx
}

func NewServiceContext(ctx fiber.Ctx) service_context.ServiceContext {
	return &ServiceContextImpl{ctx}
}

func (s *ServiceContextImpl) Context() context.Context {
	return s.ctx.Context()
}

func (s *ServiceContextImpl) Response(status int, body interface{}) error {
	return s.ctx.Status(status).JSON(body)
}

func MapResponse(status int, message string) map[string]interface{} {
	return map[string]interface{}{
		"status":  strconv.Itoa(status),
		"message": message,
	}
}
