package middleware

import (
	"net/http"
	"slices"

	jwt_service "{{cookiecutter.module_name}}/internal/domain/service/jwt"
	fiber_impl_context "{{cookiecutter.module_name}}/internal/interface/http/fiber/context"

	"github.com/gofiber/fiber/v3"
)

var publicUris = []string{"/metrics"}

func authMiddleware(ctx fiber.Ctx, jwtService *jwt_service.JwtService) error {
	if isPublicUri(string(ctx.Request().RequestURI())) {
		return ctx.Next()
	}

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

func isPublicUri(uri string) bool {
	return slices.Contains(publicUris, uri)
}

func newAuthMiddleware(jwtService *jwt_service.JwtService) func(ctx fiber.Ctx) error {
	return func(ctx fiber.Ctx) error {
		return authMiddleware(ctx, jwtService)
	}
}
