package validator_service

type ValidatorService interface {
	Struct(value interface{}) error
}
