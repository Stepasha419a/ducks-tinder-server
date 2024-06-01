package controller

import (
	"auth-service/internal/application/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type (
	AuthController struct {
		facade service.AuthService
	}
)

func NewAuthController(e *gin.Engine, facade service.AuthService) *AuthController {
	controller := &AuthController{
		facade,
	}

	e.POST("/auth/register", controller.Register)

	return controller
}

var validate = validator.New()

func (ac *AuthController) Register(c *gin.Context) {
	var registerDto *RegisterDto

	if err := c.Bind(&registerDto); err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Failed to parse request body",
		})
		return
	}

	registerCommand, err := registerDto.ToRegisterCommand(validate)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	res, err := ac.facade.Register(registerCommand)
	if err != nil {
		c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "Failed to register",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, res)
}
