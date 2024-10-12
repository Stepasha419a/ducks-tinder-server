package validator_service_impl

import (
	"log"

	"github.com/go-playground/validator/v10"
)

type ValidatorServiceImpl struct {
	validate *validator.Validate
}

func NewValidatorService() *ValidatorServiceImpl {
	log.Println("new validator service")

	validate := validator.New()

	return &ValidatorServiceImpl{
		validate,
	}
}

func (s *ValidatorServiceImpl) Struct(value interface{}) error {
	return s.validate.Struct(value)
}
