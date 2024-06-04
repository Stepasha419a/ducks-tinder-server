package broker_service

import (
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
)

func InitBroker() *amqp.Connection {
	RABBIT_MQ_URI := os.Getenv("RABBIT_MQ_URI")

	conn, err := amqp.Dial(RABBIT_MQ_URI)
	if err != nil {
		panic(err)
	}

	return conn
}

type QueueConnection struct {
	channel *amqp.Channel
	queue   *amqp.Queue
}

func InitQueue(conn *amqp.Connection, queueName string) *QueueConnection {
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

	return &QueueConnection{ch, &q}
}

func (queueConn *QueueConnection) PublishQueueMessage(message []byte) error {
	err := queueConn.channel.Publish(
		"",                   // exchange
		queueConn.queue.Name, // routing key
		false,                // mandatory
		false,                // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        message,
		},
	)

	return err
}
