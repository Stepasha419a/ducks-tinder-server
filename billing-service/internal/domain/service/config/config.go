package config_service

type (
	ConfigService interface {
		GetConfig() *Config
	}

	Config struct {
		JwtAccessSecret         string
		JwtBillingServiceSecret string
		Port                    uint16
		DatabaseUrl             string
	}
)
