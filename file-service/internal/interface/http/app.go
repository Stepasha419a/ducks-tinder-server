package http_service

import config_service "go-file-server/internal/service/config"

func NewHttpApp() *HttpService {
	port := int(config_service.GetConfig().Port)

	return NewHttpService(port, "http", NewHttpRouter())
}

func NewHealthApp() *HttpService {
	port := int(config_service.GetConfig().HealthPort)

	return NewHttpService(port, "health", NewHealthRouter())
}
