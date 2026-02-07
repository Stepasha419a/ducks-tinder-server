package http_service

import (
	"go-file-server/internal/handler"

	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func NewHttpRouter() *mux.Router {
	router := mux.NewRouter()

	router.PathPrefix("/").HandlerFunc(handler.GetFile).Methods("GET")

	return router
}

func NewHealthRouter() *mux.Router {
	router := mux.NewRouter()

	metricsHandler := promhttp.Handler()

	router.Path("/metrics").Handler(metricsHandler)

	router.Path("/livez").HandlerFunc(handler.SuccessHealth)
	router.Path("/readyz").HandlerFunc(handler.SuccessHealth)
	router.Path("/startupz").HandlerFunc(handler.SuccessHealth)

	return router
}
