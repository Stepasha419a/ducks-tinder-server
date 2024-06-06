package main

import (
	"log"
	"net/http"
	"os"
	"sync"

	router "go-file-server/src/router"
	config_service "go-file-server/src/service/config"
	grpc_service "go-file-server/src/service/grpc"
	rabbitmq_service "go-file-server/src/service/rabbitmq"
)

func main() {
	config_service.RequireEnv()

	setUpListeners()
}

func setUpListeners() {
	var wg sync.WaitGroup
	wg.Add(3)

	go grpc_service.Init()
	go setUpHttp()
	go setUpBroker()

	wg.Wait()
}

func setUpHttp() {
	PORT := os.Getenv("PORT")

	r := router.InitRouter()

	log.Printf("Serving on HTTP port: %v\n", PORT)
	log.Fatal(http.ListenAndServe("127.0.0.1:"+PORT, r))
}

func setUpBroker() {
	conn := rabbitmq_service.InitBroker()

	RABBIT_MQ_FILE_QUEUE := os.Getenv("RABBIT_MQ_FILE_QUEUE")
	ch, q := rabbitmq_service.InitQueue(conn, RABBIT_MQ_FILE_QUEUE)

	log.Printf("Serving on Broker queue: %v", RABBIT_MQ_FILE_QUEUE)

	var wg sync.WaitGroup

	wg.Add(1)

	go rabbitmq_service.HandleFileQueueMessages(ch, q)

	wg.Wait()

	defer ch.Close()
	defer conn.Close()
}
