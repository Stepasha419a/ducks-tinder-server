package handler

import (
	config_service "go-file-server/internal/service/config"
	"net/http"
)

var globalFs http.Handler = nil

func getFs() http.Handler {
	staticDirPath := config_service.GetConfig().StaticDirPath

	if globalFs == nil {
		globalFs = http.FileServer(http.Dir(staticDirPath))
	}

	return globalFs
}
