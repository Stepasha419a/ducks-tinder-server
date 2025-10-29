package connection_service

import (
	"sync"
	"time"
)

type ConnectionType string

const (
	ConnPostgres ConnectionType = "postgres"
	ConnRabbitMQ ConnectionType = "rabbitmq"
)

type ConnectionState struct {
	Type    ConnectionType
	Healthy bool
	Error   error
	Updated time.Time
}

type ConnectionService struct {
	Mu     sync.RWMutex
	States map[ConnectionType]*ConnectionState
}

func NewConnectionService() *ConnectionService {
	return &ConnectionService{
		States: make(map[ConnectionType]*ConnectionState),
	}
}

func (m *ConnectionService) UpdateState(t ConnectionType, healthy bool, err error) {
	m.Mu.Lock()
	defer m.Mu.Unlock()

	m.States[t] = &ConnectionState{Type: t, Healthy: healthy, Error: err, Updated: time.Now()}
}
