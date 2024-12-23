package middleware

import (
	jwt_service "{{cookiecutter.module_name}}/internal/domain/service/jwt"

	"github.com/gofiber/fiber/v3"
)

type Middleware struct {
	AuthMiddleware func(ctx fiber.Ctx) error
}

func NewMiddleware(jwtService *jwt_service.JwtService) *Middleware {
	return &Middleware{
		AuthMiddleware: newAuthMiddleware(jwtService),
	}
}
