package jwt_service

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

type TokenPayload struct {
	userId string
}

type Tokens struct {
	AccessToken  string
	RefreshToken string
}

func GenerateTokens(userId string) *Tokens {
	accessTokenSecret := []byte(os.Getenv("JWT_ACCESS_SECRET"))
	refreshTokenSecret := []byte(os.Getenv("JWT_REFRESH_SECRET"))

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId":    userId,
		"expiredAt": time.Now().Add(time.Hour).Unix(),
	})

	accessTokenString, err := accessToken.SignedString(accessTokenSecret)
	if err != nil {
		panic(err)
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId":    userId,
		"expiredAt": time.Now().Add(time.Hour * 24 * 31).Unix(),
	})

	refreshTokenString, err := refreshToken.SignedString(refreshTokenSecret)
	if err != nil {
		panic(err)
	}

	return &Tokens{
		AccessToken:  accessTokenString,
		RefreshToken: refreshTokenString,
	}
}

func ValidateAccessToken(accessToken string) (*TokenPayload, error) {
	secretKey := os.Getenv("JWT_ACCESS_SECRET")

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(accessToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}
	if err = claims.Valid(); err != nil {
		return nil, err
	}

	tokenPayload, err := extractTokenPayload(claims)
	if err != nil {
		return nil, err
	}

	return tokenPayload, nil
}

func ValidateRefreshToken(refreshToken string) (*TokenPayload, error) {
	secretKey := os.Getenv("JWT_REFRESH_SECRET")

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}
	if err = claims.Valid(); err != nil {
		return nil, err
	}

	tokenPayload, err := extractTokenPayload(claims)
	if err != nil {
		return nil, err
	}

	return tokenPayload, nil
}

func extractTokenPayload(claims jwt.MapClaims) (*TokenPayload, error) {
	data, ok := claims["userId"]

	if !ok {
		return nil, fmt.Errorf("invalid payload")
	}

	userIdd, ok := data.(string)

	if !ok {
		return nil, fmt.Errorf("invalid payload")
	}

	return &TokenPayload{userId: userIdd}, nil
}
