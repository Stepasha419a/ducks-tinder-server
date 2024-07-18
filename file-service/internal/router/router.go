package router

import (
	"go-file-server/internal/middleware"

	"net/http"

	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func InitRouter() *mux.Router {
	router := mux.NewRouter()

	initRoutes(router)
	initPrivateRoutes(router)

	return router
}

func initRoutes(router *mux.Router) {
	metricsHandler := promhttp.Handler()

	router.Path("/metrics").Handler(metricsHandler)
}

func initPrivateRoutes(router *mux.Router) {
	privateRouter := router.PathPrefix("/").Subrouter()

	privateRouter.Use(middleware.AuthMiddleware)

	privateRouter.PathPrefix("/").Handler(http.FileServer(http.Dir("../static"))).Methods("GET")
}
