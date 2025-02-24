package fiber_impl

import (
	"crypto/tls"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"strconv"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
	fiber_impl_context "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/fiber/context"
	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/interface/http/middleware"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/helmet"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func NewFiberApp(middleware *middleware.Middleware, configService config_service.ConfigService) (*fiber.App, func()) {
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
	app.Use(middleware.AuthMiddleware)

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
