package main

import (
	"billing-service/internal/infrastructure/database"
	config_service_impl "billing-service/internal/infrastructure/service/config_impl"
	tls_service "billing-service/internal/infrastructure/service/tls"
	validator_service_impl "billing-service/internal/infrastructure/service/validator_impl"
	"flag"
)

func main() {
	validatorServiceImpl := validator_service_impl.NewValidatorService()
	configService := config_service_impl.NewConfigService(validatorServiceImpl)
	tlsService := tls_service.NewTlsService(configService)

	autoSubmit := flag.Bool("auto-submit", false, "submit migrations automatically")
	flag.Parse()

	database.MigrateDB(configService, tlsService, *autoSubmit)
}
