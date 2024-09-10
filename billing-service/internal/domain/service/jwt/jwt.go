package jwt_service

import (
	config_service "billing-service/internal/domain/service/config"

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

func (s *JwtService) ValidateAccessToken(accessToken string) (bool, *AccessTokenPayload) {
	secretKey := s.configService.GetConfig().JwtAccessSecret

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

	return true, &AccessTokenPayload{UserId: claims.UserId}
}
