package main

import (
	"fmt"
	"log"
	"net/http"
	"path"
	"sync"

	router "go-file-server/internal/router"
	config_service "go-file-server/internal/service/config"
	grpc_service "go-file-server/internal/service/grpc"
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

	certPath := path.Join("cert", config_service.GetConfig().Mode, "certificate.pem")
	privateKeyPath := path.Join("cert", config_service.GetConfig().Mode, "private-key.pem")

	log.Printf("serving on HTTPS port: %v\n", PORT)
	log.Fatal(http.ListenAndServeTLS("0.0.0.0:"+fmt.Sprintf("%d", PORT), certPath, privateKeyPath, r))
}
