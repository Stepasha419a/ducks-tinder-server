package broker_service

import (
	connection_service "auth-service/internal/domain/service/connection"
	config_service "auth-service/internal/infrastructure/service/config"
	"crypto/tls"
	"fmt"
	"log/slog"
	"sync"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

var connectionServiceName = "rabbitmq"

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
			bs.connectionService.UpdateState(connectionServiceName, false, err)
			time.Sleep(3 * time.Second)
			continue
		}

		slog.Info("Broker connected successfully")
		bs.connectionService.UpdateState(connectionServiceName, true, err)
		bs.setConnection(conn)

		closeChan := make(chan *amqp.Error)
		conn.NotifyClose(closeChan)

		err = <-closeChan
		bs.connectionService.UpdateState(connectionServiceName, false, err)
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

func (qc *QueueConnection) initChannel(conn *amqp.Connection) {
	qc.mu.Lock()
	defer qc.mu.Unlock()

	ch, err := conn.Channel()
	if err != nil {
		slog.Error("Failed to create channel", slog.String("queue", qc.name), slog.Any("err", err))
		return
	}

	q, err := ch.QueueDeclare(
		qc.name,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		slog.Error("Failed to declare queue", slog.String("queue", qc.name), slog.Any("err", err))

		ch.Close()
		return
	}

	slog.Info("Queue connected successfully", slog.String("queue", qc.name))
	qc.channel = ch
	qc.queue = &q
}

func (qc *QueueConnection) PublishQueueMessage(message []byte) error {
	qc.mu.RLock()
	defer qc.mu.RUnlock()

	if qc.channel == nil {
		err := fmt.Errorf("queue %s not ready: channel is nil", qc.name)
		slog.Error("Publish queue message error", slog.Any("err", err))

		return err
	}

	err := qc.channel.Publish(
		"",            // exchange
		qc.queue.Name, // routing key
		false,         // mandatory
		false,         // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        message,
		},
	)

	return err
}
