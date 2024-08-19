package config_service_impl

import (
	config_service "billing-service/internal/domain/service/config"
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
		JwtAccessSecret         string `yaml:"jwt_access_secret"`
		JwtBillingServiceSecret string `yaml:"jwt_billing_service_secret"`
		Port                    int16  `yaml:"port"`
		DatabaseUrl             string `yaml:"database_url"`
	}

	ConfigServiceImpl struct{}
)

var (
	mods                                = []string{"dev", "dev-docker"}
	config *config_service.Config       = &config_service.Config{}
	_      config_service.ConfigService = (*ConfigServiceImpl)(nil)
)

func NewConfigService() *ConfigServiceImpl {
	log.Println("new config service")

	requireConfig()

	return &ConfigServiceImpl{}
}

func requireConfig() {
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

	copier.Copy(config, &parsedConfig)
}

func (c *ConfigServiceImpl) GetConfig() *config_service.Config {
	return config
}
