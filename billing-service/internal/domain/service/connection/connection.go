package connection_service

import (
	"sync"
	"time"
)

type StateType string

const (
	StateUp   StateType = "up"
	StateDown StateType = "down"
)

type ConnectionState struct {
	Type    string
	Healthy bool
	Error   error
	Updated time.Time
}

type ConnectionStateReport struct {
	Status StateType                              `json:"status"`
	Info   map[string]*ConnectionStateReportInfo  `json:"info"`
	Error  map[string]*ConnectionStateReportError `json:"error"`
}

type ConnectionStateReportInfo struct {
	Status StateType `json:"status"`
}

type ConnectionStateReportError struct {
	Status StateType `json:"status"`
	Error  string    `json:"error"`
}

type ConnectionService struct {
	Mu     sync.RWMutex
	States map[string]*ConnectionState
}

func NewConnectionService() *ConnectionService {
	return &ConnectionService{
		States: make(map[string]*ConnectionState),
	}
}

func (m *ConnectionService) UpdateState(t string, healthy bool, err error) {
	m.Mu.Lock()
	defer m.Mu.Unlock()

	m.States[t] = &ConnectionState{Type: t, Healthy: healthy, Error: err, Updated: time.Now()}
}

func (m *ConnectionService) GetConnectionStateReport() *ConnectionStateReport {
	report := &ConnectionStateReport{Status: StateUp, Info: make(map[string]*ConnectionStateReportInfo), Error: make(map[string]*ConnectionStateReportError)}

	m.Mu.RLock()
	defer m.Mu.RUnlock()

	for key, state := range m.States {
		report.Info[key] = &ConnectionStateReportInfo{Status: StateUp}

		if !state.Healthy {
			report.Status = StateDown

			report.Info[key].Status = StateDown
			report.Error[key] = &ConnectionStateReportError{Status: StateDown, Error: state.Error.Error()}
		}
	}

	return report
}
