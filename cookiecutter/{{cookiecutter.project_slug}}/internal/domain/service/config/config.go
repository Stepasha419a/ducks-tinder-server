package config_service

type (
	ConfigService interface {
		GetConfig() *Config
	}

	Config struct {
		JwtAccessSecret string
		Port            uint16
		DatabaseUrl     string
	}
)
