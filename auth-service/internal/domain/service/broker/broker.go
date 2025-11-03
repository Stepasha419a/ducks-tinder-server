package broker_service

import (
	config_service "auth-service/internal/infrastructure/service/config"
	"crypto/tls"
	"log/slog"
	"sync"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type BrokerService struct {
	mu                sync.RWMutex
	conn              *amqp.Connection
	connectionService *connection_service.ConnectionService
	tlsConfig         *tls.Config
	url               string
	queues            map[string]*QueueConnection
}

type QueueConnection struct {
	mu      sync.RWMutex
	channel *amqp.Channel
	queue   *amqp.Queue
	name    string
}

func NewBrokerService(tlsConfig *tls.Config, connectionService *connection_service.ConnectionService) *BrokerService {
	cfg := config_service.GetConfig()
	bs := &BrokerService{
		tlsConfig:         tlsConfig,
		url:               cfg.RabbitMqUrl,
		connectionService: connectionService,
		queues:            make(map[string]*QueueConnection),
	}

	go bs.connectLoop()

	return bs
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
