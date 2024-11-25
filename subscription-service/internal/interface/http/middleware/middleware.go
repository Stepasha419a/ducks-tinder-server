package middleware

import (
	jwt_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/jwt"

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
