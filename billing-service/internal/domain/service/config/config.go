package config_service

type (
	ConfigService interface {
		GetConfig() *Config
	}

	Config struct {
		JwtAccessSecret         string
		JwtBillingServiceSecret string
		Port                    int16
		DatabaseUrl             string
	}
)
