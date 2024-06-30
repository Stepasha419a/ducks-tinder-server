package config_service

import (
	"os"
	"path"
	"slices"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type (
	Config struct {
		PasswordSalt             string `yaml:"password_salt"`
		JwtRefreshSecret         string `yaml:"jwt_refresh_secret"`
		JwtAccessSecret          string `yaml:"jwt_access_secret"`
		CookieRefreshTokenMaxAge uint32 `yaml:"cookie_refresh_token_max_age"`
		CookieRefreshTokenDomain string `yaml:"cookie_refresh_token_domain"`
		Port                     uint16 `yaml:"port"`
		DatabaseUrl              string `yaml:"database_url"`
		RabbitMqUrl              string `yaml:"rabbit_mq_url"`
		RabbitMqUserQueue        string `yaml:"rabbit_mq_user_queue"`
	}
)

var (
	mods           = []string{"dev"}
	config *Config = &Config{}
)

func RequireConfig() {
	err := godotenv.Load(".env")

	if err != nil {
		panic("Error loading .env.dev file")
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

	if err := decoder.Decode(config); err != nil {
		panic(err)
	}
}

func GetConfig() *Config {
	return config
}
