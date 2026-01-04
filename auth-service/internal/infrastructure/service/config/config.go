package config_service

import (
	"log/slog"
	"os"
	"path"
	"slices"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type (
	Config struct {
		Mode                     string `validate:"required" yaml:"mode"`
		PasswordSalt             string `yaml:"password_salt"`
		JwtRefreshSecret         string `yaml:"jwt_refresh_secret"`
		JwtAccessSecret          string `yaml:"jwt_access_secret"`
		CookieRefreshTokenMaxAge uint32 `yaml:"cookie_refresh_token_max_age"`
		CookieRefreshTokenDomain string `yaml:"cookie_refresh_token_domain"`
		Port                     uint16 `yaml:"port"`
		HealthPort               uint16 `yaml:"health_port"`
		RabbitMqUrl              string `yaml:"rabbit_mq_url"`
		RabbitMqUserQueue        string `yaml:"rabbit_mq_user_queue"`
		TlsServerName            string `yaml:"tls_server_name"`
		PostgresTlsServerName    string `yaml:"postgres_tls_server_name"`
		RabbitmqTlsServerName    string `yaml:"rabbitmq_tls_server_name"`
		PostgresHost             string `yaml:"postgres_host"`
		PostgresPort             uint16 `yaml:"postgres_port"`
		PostgresUser             string `yaml:"postgres_user"`
		PostgresPassword         string `yaml:"postgres_password"`
		PostgresDatabase         string `yaml:"postgres_database"`
		GrpcUserServiceUrl       string `yaml:"grpc_user_service_url"`
	}
)

var (
	mods           = []string{"dev", "dev-docker", "dev-k8s", "prod"}
	config *Config = &Config{}
)

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
}

func GetConfig() *Config {
	return config
}
