package http_service

import (
	"go-file-server/internal/handler"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func InitRouter() *mux.Router {
	router := mux.NewRouter()

	metricsHandler := promhttp.Handler()

	router.Path("/metrics").Handler(metricsHandler)

	router.Path("/livez").HandlerFunc(handler.SuccessHealth)
	router.Path("/readyz").HandlerFunc(handler.SuccessHealth)
	router.Path("/startupz").HandlerFunc(handler.SuccessHealth)

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("../static"))).Methods("GET")

	return router
}
