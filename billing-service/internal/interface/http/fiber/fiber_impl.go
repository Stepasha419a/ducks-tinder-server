package fiber_impl

import (
	config_service "billing-service/internal/domain/service/config"
	"fmt"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v3"
)

func NewFiberApp(middleware *middleware.Middleware) (*fiber.App, func()) {
	app := fiber.New(fiber.Config{
		ErrorHandler: func(ctx fiber.Ctx, err error) error {
			return ctx.Status(http.StatusInternalServerError).JSON(fiber_impl_context.InternalServerErrorResponse)
		},
	})

	return app, func() {
		log.Println("close fiber app")
		app.Shutdown()
	}
}

func InitHttpListener(app *fiber.App, configService config_service.ConfigService) error {
	port := strconv.Itoa(int(configService.GetConfig().Port))

	err := app.Listen(fmt.Sprintf("localhost:%s", port))
	if err != nil {
		return err
	}

	return nil
}
