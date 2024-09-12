package fiber_impl

import (
	service_context "billing-service/internal/application/service/context"
	"context"

	"github.com/gofiber/fiber/v3"
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
