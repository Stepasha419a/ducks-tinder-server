package adapter

import (
	broker_service "auth-service/internal/domain/service/broker"
	user_service "auth-service/internal/domain/service/user"
	"encoding/json"
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
)

type UserServiceAdapter struct {
	userQueue *broker_service.QueueConnection
}

func NewUserService(brokerConn *amqp.Connection) user_service.UserService {
	userQueue := broker_service.InitQueue(brokerConn, os.Getenv("RABBIT_MQ_USER_QUEUE"))

	return &UserServiceAdapter{
		userQueue,
	}
}

func (adapter *UserServiceAdapter) EmitUserRegistered(dto *user_service.UserRegisteredDto) {
	body, err := json.Marshal(dto)
	if err != nil {
		panic(err)
	}

	adapter.userQueue.PublishQueueMessage(body)
}
