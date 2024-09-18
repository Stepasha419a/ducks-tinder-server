package validator_service_impl

import (
	time_service "billing-service/internal/domain/service/time"
	validator_service "billing-service/internal/domain/service/validator"
	"log"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
)

type ValidatorServiceImpl struct {
	validate *validator.Validate
}

var _ validator_service.ValidatorService = (*ValidatorServiceImpl)(nil)

func NewValidatorService() *ValidatorServiceImpl {
	log.Println("new validator service")

	validate := validator.New()

	validate.RegisterValidation("credit_card_holder", ValidateCreditCardHolder)

	return &ValidatorServiceImpl{
		validate,
	}
}

func (s *ValidatorServiceImpl) Struct(value interface{}) error {
	return s.validate.Struct(value)
}

func ValidateCreditCardHolder(fl validator.FieldLevel) bool {
	value := fl.Field().String()

	parts := strings.Split(value, " ")
	return len(parts) == 2
}
