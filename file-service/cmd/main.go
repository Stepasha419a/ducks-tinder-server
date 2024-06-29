package main

import (
	"log"
	"net/http"
	"os"
	"sync"

	router "go-file-server/internal/router"
	config_service "go-file-server/internal/service/config"
	grpc_service "go-file-server/internal/service/grpc"
)

func main() {
	config_service.RequireEnv()

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
	PORT := os.Getenv("PORT")

	r := router.InitRouter()

	log.Printf("serving on HTTP port: %v\n", PORT)
	log.Fatal(http.ListenAndServe("127.0.0.1:"+PORT, r))
}