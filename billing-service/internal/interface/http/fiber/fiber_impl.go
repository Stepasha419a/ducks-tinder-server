package fiber_impl

import (
	config_service "billing-service/internal/domain/service/config"
	tls_service "billing-service/internal/infrastructure/service/tls"
	fiber_impl_context "billing-service/internal/interface/http/fiber/context"
	"billing-service/internal/interface/http/middleware"
	"crypto/tls"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/healthcheck"
	"github.com/gofiber/fiber/v3/middleware/helmet"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

type FiberImpl struct {
	App  *fiber.App
	port int
	name string
}
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

			// method not allowed
			if status == 405 {
				response = fiber_impl_context.MethodNotAllowed
			}

			return ctx.Status(status).JSON(response)
		},
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{configService.GetConfig().ClientUrl},
		AllowHeaders:     []string{"Authorization", "Content-Type", "Origin", "Accept"},
		MaxAge:           3600,
		AllowCredentials: true,
	}))
	app.Use(helmet.New())

	return app, func() {
		log.Println("close fiber app")
		app.Shutdown()
	}
}

func InitHttpListener(app *fiber.App, configService config_service.ConfigService, tlsService *tls_service.TlsService) error {
	port := strconv.Itoa(int(configService.GetConfig().Port))

	ln, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%s", port))
	if err != nil {
		return err
	}

	tlsConfig := tlsService.GetConfig()

	ln = tls.NewListener(ln, tlsConfig)

	err = app.Listener(ln)
	if err != nil {
		return err
	}

	return nil
}
