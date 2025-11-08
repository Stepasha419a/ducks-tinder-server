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
		Mode string `yaml:"mode"`
		Port uint16 `yaml:"port"`

		GrpcPort uint16 `yaml:"grpc_port"`

		StaticDirPath string `yaml:"static_dir_path"`
	}
)

var (
	mods           = []string{"dev", "dev-docker", "dev-k8s", "prod"}
	config *Config = &Config{}
)

func RequireConfig() *Config {
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

	if err := decoder.Decode(config); err != nil {
		panic(err)
	}

	return config
}

func GetConfig() *Config {
	return config
}
