package adapter

import (
	broker_service "auth-service/internal/domain/service/broker"
	user_service "auth-service/internal/domain/service/user"
	config_service "auth-service/internal/infrastructure/service/config"
	"encoding/json"

	amqp "github.com/rabbitmq/amqp091-go"
)

type UserServiceAdapter struct {
	userQueue *broker_service.QueueConnection
}

func NewUserService(brokerConn *amqp.Connection) user_service.UserService {
	userQueue := broker_service.InitQueue(brokerConn, config_service.GetConfig().RabbitMqUserQueue)

	return &UserServiceAdapter{
		userQueue,
	}
}

func (adapter *UserServiceAdapter) EmitUserRegistered(dto *user_service.UserRegisteredDto) error {
	body, err := json.Marshal(dto)
	if err != nil {
		return err
	}

	err = adapter.userQueue.PublishQueueMessage(body)

	return err
}
