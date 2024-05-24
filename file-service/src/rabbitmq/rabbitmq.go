package rabbitmq

import (
	"encoding/json"
	"go-file-server/src/handler"
	"os"

	"github.com/mitchellh/mapstructure"
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

type Event string

const (
	UploadFilePattern Event = "upload_file"
	DeleteFilePattern Event = "delete_file"
)

type Message struct {
	Pattern Event       `json:"pattern"`
	Data    interface{} `json:"data"`
}

func handleMessage(message *amqp.Delivery, ch *amqp.Channel) {
	decodedMessage := Message{}
	err := json.Unmarshal(message.Body, &decodedMessage)
	if err != nil {
		panic(err)
	}
	switch decodedMessage.Pattern {
	case UploadFilePattern:
		event := handler.UploadFile{}

		mapstructure.Decode(decodedMessage.Data, &event)
		body, err := handler.HandleUploadFile(&event)
		if err != nil {
			responseEvent(ch, message, map[string]string{"message": err.Error()})
		}

		responseEvent(ch, message, body)
	default:
		return
	}
}

func responseEvent(ch *amqp.Channel, message *amqp.Delivery, body interface{}) {
	jsonBody, err := json.Marshal(body)
	if err != nil {
		panic(err)
	}

	err = ch.Publish(
		"",              // exchange
		message.ReplyTo, // routing key
		false,           // mandatory
		false,           // immediate
		amqp.Publishing{
			ContentType:   "text/plain",
			CorrelationId: message.CorrelationId,
			Body:          jsonBody,
		})
	if err != nil {
		panic(err)
	}
}
