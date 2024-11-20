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

var serviceToken *jwt_service.ServiceToken = nil

func (c *PerRPCCredentialsImpl) getServiceToken() string {
	if serviceToken == nil {
		serviceToken = c.jwtService.GenerateBillingServiceToken()

		return serviceToken.Token
	}

	if c.jwtService.IsExpiredUnix(serviceToken.Exp) {
		serviceToken = c.jwtService.GenerateBillingServiceToken()

		return serviceToken.Token
	}

	return serviceToken.Token
}

func (c *PerRPCCredentialsImpl) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) {
	bearerToken := "Bearer " + c.getServiceToken()

	return map[string]string{"authorization": bearerToken}, nil
}

func (c *PerRPCCredentialsImpl) RequireTransportSecurity() bool {
	return false
}
