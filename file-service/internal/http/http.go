package http_service

import (
	"net/http"
)

type HttpService struct {
	server *http.Server
}
