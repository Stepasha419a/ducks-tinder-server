package router

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func InitRouter() *mux.Router {
	router := mux.NewRouter()

	metricsHandler := promhttp.Handler()

	router.Path("/metrics").Handler(metricsHandler)

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("../static"))).Methods("GET")

	return router
}
