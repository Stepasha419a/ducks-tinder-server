package jwt_service

import (
	config_service "go-file-server/internal/service/config"

	"github.com/golang-jwt/jwt"
)

func ValidateAccessToken(accessToken string) bool {
	secretKey := config_service.GetConfig().JwtFileServiceSecret

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(accessToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		return false
	}
	if err = claims.Valid(); err != nil {
		return false
	}

	return true
}
