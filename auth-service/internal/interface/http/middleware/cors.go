package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Cors(c *gin.Context) {
	host := c.Request.Header.Get("Origin")
	c.Writer.Header().Set("Access-Control-Allow-Origin", host)
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(http.StatusNoContent)
		return
	}

	c.Next()
}
