package auth_controller

import (
	"auth-service/internal/application/service"
	config_service "auth-service/internal/infrastructure/service/config"
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
	e.POST("/auth/login", controller.Login)

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

	res, err := ac.service.Register(c.Request.Context(), registerCommand, responseErrorContext(c))
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

	setCookie(c, res.RefreshToken)

	c.JSON(http.StatusCreated, NewAuthUserPublicResponse(res))
}

func (ac *AuthController) Login(c *gin.Context) {
	var loginDto *LoginDto

	if err := c.Bind(&loginDto); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, map[string]string{
			"message":    "Failed to parse request body",
			"statusCode": strconv.Itoa(http.StatusBadRequest),
		})
		return
	}

	loginCommand, err := loginDto.ToLoginCommand(validate)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, map[string]string{
			"message":    "Validation failed: " + err.Error(),
			"statusCode": strconv.Itoa(http.StatusBadRequest),
		})
		return
	}

	res, err := ac.service.Login(c.Request.Context(), loginCommand, responseErrorContext(c))
	if res == nil {
		return
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, map[string]string{
			"message":    "Failed to login",
			"statusCode": strconv.Itoa(http.StatusInternalServerError),
		})
		return
	}

	setCookie(c, res.RefreshToken)

	c.JSON(http.StatusOK, NewAuthUserPublicResponse(res))
}

func setCookie(c *gin.Context, refreshToken string) {
	maxAge, err := strconv.Atoi(strconv.Itoa(int(config_service.GetConfig().CookieRefreshTokenMaxAge)))
	if err != nil {
		panic("wrong max age")
	}
	c.SetCookie("refreshToken", refreshToken, maxAge, "/auth", config_service.GetConfig().CookieRefreshTokenDomain, true, true)
}

func responseErrorContext(c *gin.Context) func(status int, message string) {
	return func(status int, message string) {
		c.AbortWithStatusJSON(status, map[string]string{
			"message":    message,
			"statusCode": strconv.Itoa(status),
		})
	}
}
