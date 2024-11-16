package jwt_service

import (
	"time"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"

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

func (s *JwtService) ValidateSubscriptionServiceToken(serviceToken string) (bool, *AccessTokenPayload) {
	secretKey := s.configService.GetConfig().JwtSubscriptionServiceSecret

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

	if !claims.VerifyExpiresAt(time.Now().Unix(), true) {
		return false, nil
	}

	return true, &AccessTokenPayload{UserId: claims.UserId}
}

type ServiceToken struct {
	Token string
	Exp   int64
}

func (s *JwtService) GenerateBillingServiceToken() *ServiceToken {
	serviceTokenSecret := []byte(s.configService.GetConfig().JwtBillingServiceSecret)

	exp := time.Now().Add(time.Hour).Unix()
	serviceToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": exp,
	})

	serviceTokenString, err := serviceToken.SignedString(serviceTokenSecret)
	if err != nil {
		panic(err)
	}

	return &ServiceToken{
		Token: serviceTokenString,
		Exp:   exp,
	}
}

func (s *JwtService) IsExpiredUnix(unix int64) bool {
	return time.Unix(unix, 0).Compare(time.Now()) < 0
}
