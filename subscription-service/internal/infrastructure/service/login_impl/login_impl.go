package login_service_impl

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"

	config_service "github.com/Stepasha419a/ducks-tinder-server/subscription-service/internal/domain/service/config"
)

type LoginServiceImpl struct {
	configService config_service.ConfigService
}

func NewLoginServiceImpl(configService config_service.ConfigService) *LoginServiceImpl {
	return &LoginServiceImpl{configService}
}
