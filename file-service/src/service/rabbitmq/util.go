package rabbitmq

import (
	"encoding/json"

	amqp "github.com/rabbitmq/amqp091-go"
)

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

func handlePanic(ch *amqp.Channel, message *amqp.Delivery) {
	r := recover()
	if r != nil {
		responseEvent(ch, message, map[string]string{"message": "internal error"})
	}
}
