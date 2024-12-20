package config_service

type (
	ConfigService interface {
		GetConfig() *Config
	}

	Config struct {
		Mode                         string
		JwtAccessSecret              string
		JwtSubscriptionServiceSecret string
		JwtBillingServiceSecret      string
		Port                         uint16
		GrpcPort                     uint16
		ClientUrl                    string
		GrpcBillingServiceUrl        string
		GrpcBillingServiceDomain     string
		LoginServiceUrl              string
		PostgresHost                 string
		PostgresPort                 uint16
		PostgresUser                 string
		PostgresPassword             string
		PostgresDatabase             string
		PostgresRootDatabase         string
	}
)
