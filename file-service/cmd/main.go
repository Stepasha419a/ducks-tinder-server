package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	router "go-file-server/internal/router"
	config_service "go-file-server/internal/service/config"
	grpc_service "go-file-server/internal/service/grpc"
	tls_service "go-file-server/internal/service/tls"
)

func main() {
	config_service.RequireConfig()

	setUpListeners()
}

func setUpListeners() {
	wg := sync.WaitGroup{}
	wg.Add(2)

	go grpc_service.Init()
	go setUpHttp()

	wg.Wait()
}

func setUpHttp() {
	PORT := config_service.GetConfig().Port

	r := router.InitRouter()

	log.Printf("serving on HTTPS port: %v\n", PORT)

	tlsConfig := tls_service.GetConfig()

	server := &http.Server{
		Addr:      "0.0.0.0:" + fmt.Sprintf("%d", PORT),
		Handler:   r,
		TLSConfig: tlsConfig,
	}

	err := server.ListenAndServeTLS("", "")
	if err != nil {
		log.Fatalf("server failed to start: %v", err)
	}
}
