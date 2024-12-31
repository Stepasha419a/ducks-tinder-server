package main

import (
	"flag"

	config_service_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/config_impl"
	tls_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/tls"
	validator_service_impl "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/service/validator_impl"

	"github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/infrastructure/database"
)

func main() {
	validatorServiceImpl := validator_service_impl.NewValidatorService()
	configService := config_service_impl.NewConfigService(validatorServiceImpl)
	tlsService := tls_service.NewTlsService(configService)

	autoSubmit := flag.Bool("auto-submit", false, "submit migrations automatically")
	flag.Parse()

	database.MigrateDB(configService, tlsService, *autoSubmit)
}
