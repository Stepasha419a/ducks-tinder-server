package fiber_impl

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	config_service "{{cookiecutter.module_name}}/internal/domain/service/config"
	fiber_impl_context "{{cookiecutter.module_name}}/internal/interface/http/fiber/context"
	"{{cookiecutter.module_name}}/internal/interface/http/middleware"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func NewFiberApp(middleware *middleware.Middleware) (*fiber.App, func()) {
	app := fiber.New(fiber.Config{
		ErrorHandler: func(ctx fiber.Ctx, err error) error {
			status := http.StatusInternalServerError

			var e *fiber.Error
			if errors.As(err, &e) {
				status = e.Code
			}

			return ctx.Status(status).JSON(fiber_impl_context.InternalServerErrorResponse)
		},
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(middleware.AuthMiddleware)

	return app, func() {
		log.Println("close fiber app")
		app.Shutdown()
	}
}

func InitHttpListener(app *fiber.App, configService config_service.ConfigService) error {
	port := strconv.Itoa(int(configService.GetConfig().Port))

	err := app.Listen(fmt.Sprintf("0.0.0.0:%s", port))
	if err != nil {
		return err
	}

	return nil
}
