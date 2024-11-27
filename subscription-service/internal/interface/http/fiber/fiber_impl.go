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
	})
	return app, func() {
		log.Println("close fiber app")
		app.Shutdown()
	}
}
