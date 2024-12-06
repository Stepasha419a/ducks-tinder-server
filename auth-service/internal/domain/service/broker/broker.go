package broker_service

import (
	config_service "auth-service/internal/infrastructure/service/config"
	"crypto/tls"
	"crypto/x509"
	"log/slog"
	"os"
	"path"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

var (
	conn *amqp.Connection = nil
	err  error            = nil
)

func InitBroker(tlsConfig *tls.Config) *amqp.Connection {
	RABBIT_MQ_URL := config_service.GetConfig().RabbitMqUrl

	if err != nil {
		slog.Error("Broker cert error", slog.Any("err", err))
	}

	slog.Info("Broker connecting")

	conn, err = amqp.DialTLS(RABBIT_MQ_URL, tlsConfig)
	if err != nil {
		slog.Error("Broker connection error, reconnecting", slog.Any("err", err))
		reconnect()
	}

	slog.Info("Broker successfully connected")

	return conn
}

func requireTlsConfig(mode string) (*tls.Config, error) {
	rootCertPath := path.Join("cert", mode, "ca.crt")
	certPath := path.Join("cert", mode, "certificate.pem")
	privateKeyPath := path.Join("cert", mode, "private-key.pem")

	cfg := &tls.Config{}

	cfg.RootCAs = x509.NewCertPool()

	ca, err := os.ReadFile(rootCertPath)
	if err != nil {
		return nil, err
	}

	cert, err := tls.LoadX509KeyPair(certPath, privateKeyPath)
	if err != nil {
		return nil, err
	}

	cfg.Certificates = append(cfg.Certificates, cert)
	cfg.RootCAs.AppendCertsFromPEM(ca)

	return cfg, nil
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
