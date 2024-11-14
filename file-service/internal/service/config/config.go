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
		Mode string `yaml:"mode"`
		Port uint16 `yaml:"port"`

		GrpcPort uint16 `yaml:"grpc_port"`
	}
)

var (
	mods           = []string{"dev", "dev-docker"}
	config *Config = &Config{}
)

func RequireConfig() *Config {
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

	return config
}

func GetConfig() *Config {
	return config
}
