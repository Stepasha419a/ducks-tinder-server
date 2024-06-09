package jwt_service

import (
	"os"

	"github.com/golang-jwt/jwt"
)

func ValidateAccessToken(accessToken string) bool {
	secretKey := os.Getenv("JWT_FILE_SERVICE_SECRET")

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
