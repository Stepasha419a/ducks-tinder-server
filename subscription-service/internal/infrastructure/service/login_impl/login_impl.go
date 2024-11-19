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

var latestLoginsData = &LatestLoginsData{}

func (s *LoginServiceImpl) CheckLogin(login string) (bool, error) {
	logins, err := latestLoginsData.GetLogins(s.configService)
	if err != nil {
		return false, err
	}
	if logins == nil {
		return false, nil
	}

	for _, loginData := range *logins {
		if strings.EqualFold(loginData.Login, login) {
			return true, nil
		}
	}

	return false, nil
}

type LatestLoginsData struct {
	data        *[]LoginData
	requestTime time.Time
}

type LoginData struct {
	Login string
}

var freshRequestTimeDuration = time.Minute * 5

func (d *LatestLoginsData) IsValid() bool {
	if d.data == nil || d.requestTime.IsZero() {
		return false
	}

	return d.requestTime.Add(freshRequestTimeDuration).Compare(time.Now()) > 0
}

func (d *LatestLoginsData) GetLogins(configService config_service.ConfigService) (*[]LoginData, error) {
	if d.IsValid() {
		return d.data, nil
	}

	logins, err := requestLogins(configService)
	if err != nil {
		return nil, err
	}
	if logins == nil {
		return nil, nil
	}

	d.data = logins
	d.requestTime = time.Now().Add(freshRequestTimeDuration)

	return d.data, nil
}

func requestLogins(configService config_service.ConfigService) (*[]LoginData, error) {
	resp, err := http.Get(configService.GetConfig().LoginServiceUrl)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, nil
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	loginData := &[]LoginData{}

	err = json.Unmarshal(body, loginData)
	if err != nil {
		return nil, err
	}

	return loginData, nil
}
