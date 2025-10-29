package connection_service

import (
	"sync"
	"time"
)

type ConnectionType string

const (
	ConnPostgres ConnectionType = "postgres"
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
