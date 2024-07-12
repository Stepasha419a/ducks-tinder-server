package broker_service

import (
	config_service "auth-service/internal/infrastructure/service/config"
	"log/slog"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

var (
	conn *amqp.Connection = nil
	err  error            = nil
)

func InitBroker() *amqp.Connection {
	RABBIT_MQ_URL := config_service.GetConfig().RabbitMqUrl

	slog.Info("Broker connecting")

	conn, err = amqp.Dial(RABBIT_MQ_URL)
	if err != nil {
		slog.Error("Broker connection error, reconnecting", slog.Any("err", err))
		reconnect()
	}

	slog.Info("Broker successfully connected")

	return conn
}

func reconnect() {
	attempts := 0
	ticker := time.NewTicker(time.Second * 3)
	RABBIT_MQ_URL := config_service.GetConfig().RabbitMqUrl

	for range ticker.C {
		attempts++
		slog.Info("Broker connecting", slog.Int("attempts", attempts))
		if attempts >= 10 {
			slog.Error("Broker connection error", slog.Any("err", err))
			panic(err)
		}
		slog.Error("Broker connection error, reconnecting", slog.Any("err", err))

		conn, err = amqp.Dial(RABBIT_MQ_URL)
		if err == nil {
			ticker.Stop()
			break
		}
	}
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
