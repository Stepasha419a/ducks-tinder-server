package controller

import (
	"auth-service/internal/application/service"
	"net/http"

	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type (
	AuthController struct {
		service service.AuthService
	}
)

func NewAuthController(e *gin.Engine, service service.AuthService) *AuthController {
	controller := &AuthController{
		service,
	}

	e.POST("/auth/register", controller.Register)

	return controller
}

var validate = validator.New()

func (ac *AuthController) Register(c *gin.Context) {
	var registerDto *RegisterDto

	if err := c.Bind(&registerDto); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, map[string]string{
			"message":    "Failed to parse request body",
			"statusCode": strconv.Itoa(http.StatusBadRequest),
		})
		return
	}

	registerCommand, err := registerDto.ToRegisterCommand(validate)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, map[string]string{
			"message":    "Validation failed: " + err.Error(),
			"statusCode": strconv.Itoa(http.StatusBadRequest),
		})
		return
	}

	res, err := ac.service.Register(registerCommand, responseErrorContext(c))
	if res == nil {
		return
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, map[string]string{
			"message":    "Failed to register",
			"statusCode": strconv.Itoa(http.StatusInternalServerError),
		})
		return
	}

	c.JSON(http.StatusCreated, res)
}

func responseErrorContext(c *gin.Context) func(status int, message string) {
	return func(status int, message string) {
		c.AbortWithStatusJSON(status, map[string]string{
			"message":    message,
			"statusCode": strconv.Itoa(status),
		})
	}
}
