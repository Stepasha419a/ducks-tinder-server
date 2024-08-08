package config_service

import (
	"log"
	"os"
	"path"
	"slices"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type (
	Config struct {
		AuthServiceDatabaseUrl string `yaml:"auth_service_database_url"`
		PrismaDatabaseUrl      string `yaml:"prisma_database_url"`
	}
)

var (
	mods           = []string{"dev"}
	config *Config = &Config{}
)

func RequireConfig() {
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

	if err := decoder.Decode(config); err != nil {
		panic(err)
	}

	log.Print("config required")
}

func GetConfig() *Config {
	return config
}
