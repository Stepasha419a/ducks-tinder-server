package config_service_impl

import (
	"log"
	"os"
	"path"
	"slices"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
	validator_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/validator"

	"github.com/jinzhu/copier"
	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type (
	parsedConfig struct {
		Mode                         string `validate:"required" yaml:"mode"`
		JwtAccessSecret              string `validate:"required" yaml:"jwt_access_secret"`
		JwtSubscriptionServiceSecret string `validate:"required" yaml:"jwt_subscription_service_secret"`
		JwtBillingServiceSecret      string `validate:"required" yaml:"jwt_billing_service_secret"`
		Port                         uint16 `validate:"required" yaml:"port"`
		GrpcPort                     uint16 `validate:"required" yaml:"grpc_port"`
		ClientUrl                    string `validate:"required" yaml:"client_url"`
		GrpcBillingServiceUrl        string `validate:"required" yaml:"grpc_billing_service_url"`
		GrpcBillingServiceDomain     string `validate:"required" yaml:"grpc_billing_service_domain"`
		LoginServiceUrl              string `validate:"required" yaml:"login_service_url"`
		TlsServerName                string `validate:"required" yaml:"tls_server_name"`
		PostgresHost                 string `validate:"required" yaml:"postgres_host"`
		PostgresPort                 uint16 `validate:"required" yaml:"postgres_port"`
		PostgresUser                 string `validate:"required" yaml:"postgres_user"`
		PostgresPassword             string `validate:"required" yaml:"postgres_password"`
		PostgresDatabase             string `validate:"required" yaml:"postgres_database"`
		PostgresRootDatabase         string `validate:"required" yaml:"postgres_root_database"`
	}

	ConfigServiceImpl struct{}
)

var (
	mods                          = []string{"dev", "dev-docker", "dev-k8s"}
	config *config_service.Config = &config_service.Config{}
)

func NewConfigService(validatorService validator_service.ValidatorService) *ConfigServiceImpl {
	log.Println("new config service")

	requireConfig(validatorService)

	return &ConfigServiceImpl{}
}

func requireConfig(validatorService validator_service.ValidatorService) {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("warning: no .env file found, using environment variables")
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

	parsedConfig := parsedConfig{}
	if err := decoder.Decode(&parsedConfig); err != nil {
		panic(err)
	}

	err = validatorService.Struct(parsedConfig)
	if err != nil {
		panic(err)
	}

	copier.Copy(config, &parsedConfig)
}

func (c *ConfigServiceImpl) GetConfig() *config_service.Config {
	return config
}
