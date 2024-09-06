package fiber_impl

import (
	config_service "billing-service/internal/domain/service/config"
	"fmt"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v3"
)

func NewFiberApp() (*fiber.App, func()) {
	app := fiber.New()

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
