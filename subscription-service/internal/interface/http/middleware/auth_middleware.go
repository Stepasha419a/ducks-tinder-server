package middleware

import (
	"net/http"
	"slices"

	jwt_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/jwt"
	fiber_impl_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/fiber/context"

	"github.com/gofiber/fiber/v3"
)

var publicUris = []string{"/metrics"}

func authMiddleware(ctx fiber.Ctx, jwtService *jwt_service.JwtService) error {
	authorization := ctx.Get(fiber.HeaderAuthorization)

	if authorization == "" || len(authorization) < 7 || authorization[:6] != "Bearer" {
		return ctx.Status(http.StatusUnauthorized).JSON(fiber_impl_context.UnauthorizedResponse)
	}

	isValid, payload := jwtService.ValidateAccessToken(authorization[7:])
	if !isValid {
		return ctx.Status(http.StatusUnauthorized).JSON(fiber_impl_context.UnauthorizedResponse)
	}

	ctx.Locals("userId", payload.UserId)

	return ctx.Next()
}
