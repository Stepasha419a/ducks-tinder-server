package config_service

import (
	"log/slog"
	"os"
	"path"
	"slices"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type (
	Config struct {
		Mode                       string `validate:"required" yaml:"mode"`
		PasswordSalt               string `validate:"required" yaml:"password_salt"`
		JwtRefreshSecret           string `validate:"required" yaml:"jwt_refresh_secret"`
		JwtAccessSecret            string `validate:"required" yaml:"jwt_access_secret"`
		CookieRefreshTokenMaxAge   uint32 `validate:"required" yaml:"cookie_refresh_token_max_age"`
		CookieRefreshTokenDomain   string `validate:"required" yaml:"cookie_refresh_token_domain"`
		CookieRefreshTokenSameSite uint8  `validate:"required" yaml:"cookie_refresh_token_same_site"`
		Port                       uint16 `validate:"required" yaml:"port"`
		HealthPort                 uint16 `validate:"required" yaml:"health_port"`
		TlsServerName              string `validate:"required" yaml:"tls_server_name"`
		PostgresTlsServerName      string `validate:"required" yaml:"postgres_tls_server_name"`
		PostgresHost               string `validate:"required" yaml:"postgres_host"`
		PostgresPort               uint16 `validate:"required" yaml:"postgres_port"`
		PostgresUser               string `validate:"required" yaml:"postgres_user"`
		PostgresPassword           string `validate:"required" yaml:"postgres_password"`
		PostgresDatabase           string `validate:"required" yaml:"postgres_database"`
		GrpcUserServiceUrl         string `validate:"required" yaml:"grpc_user_service_url"`
	}
)

var (
	mods           = []string{"dev", "dev-docker", "dev-k8s", "prod"}
	config *Config = &Config{}
)

var validatorService = validator.New()

func RequireConfig() {
	if err := godotenv.Load(".env"); err != nil {
		slog.Warn("no .env file found, using environment variables")
	}

	mode := os.Getenv("MODE")
	if mode == "" {
		panic("MODE environment variable not set")
	}

	if !slices.Contains(mods, mode) {
		panic("Unknown config mode: " + mode)
	}

	filename := mode + ".yaml"
	file, err := os.Open(path.Join("config", filename))

	if err != nil || file == nil {
		panic("Error loading " + filename + " config file")
	}
	defer file.Close()
	decoder := yaml.NewDecoder(file)

	if err := decoder.Decode(config); err != nil {
		panic(err)
	}

	err = validatorService.Struct(config)
	if err != nil {
		panic(err)
	}
}

func GetConfig() *Config {
	return config
}
