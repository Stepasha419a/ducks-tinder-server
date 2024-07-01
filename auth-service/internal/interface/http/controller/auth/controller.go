package auth_controller

import (
	"auth-service/internal/application/service"
	config_service "auth-service/internal/infrastructure/service/config"
	"log/slog"
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
	e.GET("/auth/refresh", controller.Refresh)
	e.PATCH("/auth/logout", controller.Logout)

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

func (ac *AuthController) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{
			"message":    "Unauthorized",
			"statusCode": strconv.Itoa(http.StatusUnauthorized),
		})
		return
	}

	rawRefreshDto := RawRefreshDto{RefreshToken: refreshToken}
	refreshCommand, err := rawRefreshDto.ToRefreshCommand(validate)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{
			"message":    "Unauthorized",
			"statusCode": strconv.Itoa(http.StatusUnauthorized),
		})
		return
	}

	res, err := ac.service.Refresh(c.Request.Context(), refreshCommand, responseErrorContext(c))
	if res == nil {
		return
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, map[string]string{
			"message":    "Failed to refresh",
			"statusCode": strconv.Itoa(http.StatusInternalServerError),
		})
		return
	}

	setCookie(c, res.RefreshToken)

	c.JSON(http.StatusOK, NewAuthUserPublicResponse(res))
}

func (ac *AuthController) Logout(c *gin.Context) {
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{
			"message":    "Unauthorized",
			"statusCode": strconv.Itoa(http.StatusUnauthorized),
		})
		return
	}

	rawLogoutDto := RawLogoutDto{RefreshToken: refreshToken}
	logoutCommand, err := rawLogoutDto.ToLogoutCommand(validate)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, map[string]string{
			"message":    "Unauthorized",
			"statusCode": strconv.Itoa(http.StatusUnauthorized),
		})
		return
	}

	err = ac.service.Logout(c.Request.Context(), logoutCommand, responseErrorContext(c))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, map[string]string{
			"message":    "Failed to refresh",
			"statusCode": strconv.Itoa(http.StatusInternalServerError),
		})
		slog.Error(err.Error())
		return
	}

	c.SetCookie("refreshToken", "", -1000, "/auth", config_service.GetConfig().CookieRefreshTokenDomain, true, true)

	c.JSON(http.StatusOK, nil)
}

func setCookie(c *gin.Context, refreshToken string) {
	maxAge := int(config_service.GetConfig().CookieRefreshTokenMaxAge)
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
