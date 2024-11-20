package billing_service_impl

import (
	"context"

	jwt_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/jwt"
)

type PerRPCCredentials interface {
	GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error)
	RequireTransportSecurity() bool
}

type PerRPCCredentialsImpl struct {
	jwtService *jwt_service.JwtService
}

func NewPerRPCCredentialsImpl(jwtService *jwt_service.JwtService) *PerRPCCredentialsImpl {
	return &PerRPCCredentialsImpl{jwtService}
}
