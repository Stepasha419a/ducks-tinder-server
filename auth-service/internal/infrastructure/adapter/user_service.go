package adapter

import (
	broker_service "auth-service/internal/domain/service/broker"
	user_service "auth-service/internal/domain/service/user"
	config_service "auth-service/internal/infrastructure/service/config"
	"encoding/json"
)

type UserServiceAdapter struct {
	userQueue *broker_service.QueueConnection
}

func NewUserService(brokerService *broker_service.BrokerService) user_service.UserService {
	userQueue := brokerService.InitQueue(config_service.GetConfig().RabbitMqUserQueue)

	return &UserServiceAdapter{
		userQueue,
	}
}

func (adapter *UserServiceAdapter) EmitUserRegistered(dto *user_service.UserRegisteredDto) error {
	body, err := json.Marshal(map[string]interface{}{"data": dto, "pattern": "create_user"})
	if err != nil {
		return err
	}

	err = adapter.userQueue.PublishQueueMessage(body)

	return err
}
