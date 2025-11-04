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

func (bs *BrokerService) connectLoop() {
	for {
		conn, err := amqp.DialTLS(bs.url, bs.tlsConfig)
		if err != nil {
			slog.Error("Broker connection failed", slog.Any("err", err))
			bs.connectionService.UpdateState(connection_service.ConnRabbitMQ, false, err)
			time.Sleep(3 * time.Second)
			continue
		}

		slog.Info("Broker connected successfully")
		bs.connectionService.UpdateState(connection_service.ConnRabbitMQ, true, err)
		bs.setConnection(conn)

		closeChan := make(chan *amqp.Error)
		conn.NotifyClose(closeChan)

		err = <-closeChan
		bs.connectionService.UpdateState(connection_service.ConnRabbitMQ, false, err)
		slog.Error("Broker connection closed", slog.Any("err", err))

		bs.setConnection(nil)
		time.Sleep(3 * time.Second)
	}
}

func (bs *BrokerService) setConnection(conn *amqp.Connection) {
	bs.mu.Lock()
	bs.conn = conn
	bs.mu.Unlock()

	if conn == nil {
		return
	}

	bs.mu.RLock()
	for _, qc := range bs.queues {
		qc.initChannel(conn)
	}
	bs.mu.RUnlock()
}

func (b *BrokerService) InitQueue(queueName string) *QueueConnection {
	b.mu.Lock()
	defer b.mu.Unlock()

	if qc, ok := b.queues[queueName]; ok {
		return qc
	}

	qc := &QueueConnection{name: queueName}
	b.queues[queueName] = qc

	if b.conn != nil {
		qc.initChannel(b.conn)
	}

	return qc
}
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
