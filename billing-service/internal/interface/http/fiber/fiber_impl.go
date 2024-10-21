package fiber_impl

import (
	config_service "billing-service/internal/domain/service/config"
	fiber_impl_context "billing-service/internal/interface/http/fiber/context"
	"billing-service/internal/interface/http/middleware"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/helmet"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func NewFiberApp(middleware *middleware.Middleware) (*fiber.App, func()) {
	app := fiber.New(fiber.Config{
		ErrorHandler: func(ctx fiber.Ctx, err error) error {
			status := http.StatusInternalServerError
			response := fiber_impl_context.InternalServerErrorResponse

			var e *fiber.Error
			if errors.As(err, &e) {
				status = e.Code
			}

			// route not found
			if status == 404 {
				response = fiber_impl_context.NotFound
			}

			return ctx.Status(status).JSON(response)
		},
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(helmet.New())
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
