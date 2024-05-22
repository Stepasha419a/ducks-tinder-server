package router

import (
	handler "go-file-server/src/handler"
	"go-file-server/src/middleware"

	"net/http"

	"github.com/gorilla/mux"
)

func InitRouter() *mux.Router {
	router := mux.NewRouter()

	router.Use(middleware.AuthMiddleware)

	router.HandleFunc("/{fileName}", handler.HandleDeleteFile).Methods("DELETE")

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("static"))).Methods("GET")

	return router
}
