package main

import (
	"log"
	"net/http"
	"os"
	"sync"

	config "go-file-server/src/config"
	rabbitmq "go-file-server/src/rabbitmq"
	router "go-file-server/src/router"
)

func main() {
	config.RequireEnv()

	setUpListeners()
}

func setUpListeners() {
	var wg sync.WaitGroup
	wg.Add(2)

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
	conn := rabbitmq.InitBroker()

	RABBIT_MQ_FILE_QUEUE := os.Getenv("RABBIT_MQ_FILE_QUEUE")
	ch, q := rabbitmq.InitQueue(conn, RABBIT_MQ_FILE_QUEUE)

	var wg sync.WaitGroup

	wg.Add(2)

	go rabbitmq.HandleFileQueueMessages(ch, q)

	wg.Wait()

	defer ch.Close()
	defer conn.Close()
}
