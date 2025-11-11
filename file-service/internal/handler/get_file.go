package handler

import (
	config_service "go-file-server/internal/service/config"
	"net/http"
	"os"
)

var globalFs http.Handler = nil

func GetFile(w http.ResponseWriter, r *http.Request) {
	staticDirPath := config_service.GetConfig().StaticDirPath
	fs := getFs()
	file := staticDirPath + r.URL.Path

	info, err := os.Stat(file)
	if err == nil && info.IsDir() {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	fs.ServeHTTP(w, r)
}

func getFs() http.Handler {
	staticDirPath := config_service.GetConfig().StaticDirPath

	if globalFs == nil {
		globalFs = http.FileServer(http.Dir(staticDirPath))
	}

	return globalFs
}
