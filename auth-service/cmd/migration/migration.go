package main

import (
	"auth-service/internal/infrastructure/database"
	config_service "auth-service/internal/infrastructure/service/config"
	"flag"
)

func main() {
	config_service.RequireConfig()

	autoSubmit := flag.Bool("auto-submit", false, "submit migrations automatically")
	flag.Parse()

	database.MigrateDB(*autoSubmit)
}
