package middleware

import (
	"fmt"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt"

	util "go-file-server/src/util"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, err := getAccessToken(r)

		if err != nil {
			util.JSONError(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		err = verifyAccessToken(token)

		if err != nil {
			util.JSONError(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func getAccessToken(r *http.Request) (string, error) {
	token := r.Header.Get("Authorization")

	if token != "" && token[:6] == "Bearer" && len(token) > 7 {
		return token[7:], nil
	} else {
		return "", fmt.Errorf("invalid access token")
	}
}

func verifyAccessToken(tokenString string) error {
	secretKey := os.Getenv("JWT_ACCESS_SECRET")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return err
	}

	if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return nil
	} else {
		return fmt.Errorf("invalid access token")
	}
}
