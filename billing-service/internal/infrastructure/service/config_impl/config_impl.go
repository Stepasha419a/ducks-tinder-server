package config_service_impl

import (
	config_service "billing-service/internal/domain/service/config"
	validator_service "billing-service/internal/domain/service/validator"
	"log"
	"os"
	"path"
	"slices"

	"github.com/jinzhu/copier"
	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type (
	parsedConfig struct {
		Mode                    string `validate:"required" yaml:"mode"`
		JwtAccessSecret         string `validate:"required" yaml:"jwt_access_secret"`
		JwtBillingServiceSecret string `validate:"required" yaml:"jwt_billing_service_secret"`
		Port                    uint16 `validate:"required" yaml:"port"`
		GrpcPort                uint16 `validate:"required" yaml:"grpc_port"`
		ClientUrl               string `validate:"required" yaml:"client_url"`
		TlsServerName           string `yaml:"tls_server_name"`
		PostgresHost            string `validate:"required" yaml:"postgres_host"`
		PostgresPort            uint16 `validate:"required" yaml:"postgres_port"`
		PostgresUser            string `validate:"required" yaml:"postgres_user"`
		PostgresPassword        string `validate:"required" yaml:"postgres_password"`
		PostgresDatabase        string `validate:"required" yaml:"postgres_database"`
		PostgresRootDatabase    string `validate:"required" yaml:"postgres_root_database"`
	}

	ConfigServiceImpl struct{}
)

var (
	mods                                = []string{"dev", "dev-docker"}
	config *config_service.Config       = &config_service.Config{}
	_      config_service.ConfigService = (*ConfigServiceImpl)(nil)
)

func NewConfigService(validatorService validator_service.ValidatorService) *ConfigServiceImpl {
	log.Println("new config service")

	requireConfig(validatorService)

	return &ConfigServiceImpl{}
}

func requireConfig(validatorService validator_service.ValidatorService) {
	err := godotenv.Load(".env")

	if err != nil {
		panic("Error loading .env file")
	}

	mode := os.Getenv("MODE")
	if !slices.Contains(mods, mode) {
		panic("Error unknown config mode")
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
