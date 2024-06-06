package rabbitmq_service

import (
	"encoding/json"
	"go-file-server/src/handler"

	"github.com/mitchellh/mapstructure"
	amqp "github.com/rabbitmq/amqp091-go"
)

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
	defer handlePanic(ch, message)

	decodedMessage := Message{}
	err := json.Unmarshal(message.Body, &decodedMessage)
	if err != nil {
		panic(err)
	}
	switch decodedMessage.Pattern {
	case UploadFilePattern:
		uploadFile(ch, message, &decodedMessage)
	case DeleteFilePattern:
		deleteFile(ch, message, &decodedMessage)
	default:
		responseEvent(ch, message, map[string]string{"message": "invalid event"})
	}
}

func uploadFile(ch *amqp.Channel, message *amqp.Delivery, decodedMessage *Message) {
	event := handler.UploadFileRequest{}

	mapstructure.Decode(decodedMessage.Data, &event)
	body, err := handler.UploadFile(&event)
	if err != nil {
		responseEvent(ch, message, map[string]string{"message": err.Error()})
		return
	}

	responseEvent(ch, message, body)
}

func deleteFile(ch *amqp.Channel, message *amqp.Delivery, decodedMessage *Message) {
	event := handler.DeleteFileRequest{}

	mapstructure.Decode(decodedMessage.Data, &event)
	body, err := handler.DeleteFile(&event)
	if err != nil {
		responseEvent(ch, message, map[string]string{"message": err.Error()})
		return
	}

	responseEvent(ch, message, body)
}
