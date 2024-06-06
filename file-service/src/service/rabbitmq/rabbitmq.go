package rabbitmq

import (
	"log"
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
)

func InitBroker() *amqp.Connection {
	RABBIT_MQ_URI := os.Getenv("RABBIT_MQ_URI")

	log.Printf("Serving on amqp: %v\n", RABBIT_MQ_URI)
	conn, err := amqp.Dial(RABBIT_MQ_URI)
	if err != nil {
		panic(err)
	}

	return conn
}

func InitQueue(conn *amqp.Connection, queueName string) (*amqp.Channel, *amqp.Queue) {
	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}

	q, err := ch.QueueDeclare(
		queueName,
		true,  // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,
	)
	if err != nil {
		panic(err)
	}

	return ch, &q
}

func HandleFileQueueMessages(ch *amqp.Channel, q *amqp.Queue) {
	messages, err := ch.Consume(
		q.Name,
		"",    // consumer
		true,  // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,
	)
	if err != nil {
		panic(err)
	}

	var forever chan struct{}

	go func() {
		for message := range messages {
			handleMessage(&message, ch)
		}
	}()

	<-forever
}
