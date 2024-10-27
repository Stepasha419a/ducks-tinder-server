package jwt_service

import (
	config_service "billing-service/internal/domain/service/config"
	"time"

	"github.com/golang-jwt/jwt"
)

type JwtService struct {
	configService config_service.ConfigService
}

type AccessTokenClaims struct {
	AccessTokenPayload
	jwt.StandardClaims
}

type AccessTokenPayload struct {
	UserId string `json:"userId"`
}

func NewJwtService(configService config_service.ConfigService) *JwtService {
	return &JwtService{configService}
}

func (s *JwtService) ValidateBillingServiceToken(serviceToken string) (bool, *AccessTokenPayload) {
	secretKey := s.configService.GetConfig().JwtBillingServiceSecret

	return validateToken(serviceToken, secretKey)
}

func (s *JwtService) ValidateAccessToken(accessToken string) (bool, *AccessTokenPayload) {
	secretKey := s.configService.GetConfig().JwtAccessSecret

	return validateToken(accessToken, secretKey)
}

func validateToken(accessToken string, secretKey string) (bool, *AccessTokenPayload) {
	token, err := jwt.ParseWithClaims(accessToken, &AccessTokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return false, nil
	}

	err = token.Claims.Valid()
	if err != nil {
		return false, nil
	}

	claims, ok := token.Claims.(*AccessTokenClaims)
	if !ok || !token.Valid {
		return false, nil
	}

	if time.Unix(claims.ExpiresAt, 0).Compare(time.Now()) < 0 {
		return false, nil
	}

	return true, &AccessTokenPayload{UserId: claims.UserId}
}
