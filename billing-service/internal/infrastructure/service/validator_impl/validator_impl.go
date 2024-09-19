package validator_service_impl

import (
	time_service "billing-service/internal/domain/service/time"
	validator_service "billing-service/internal/domain/service/validator"
	"log"
	"strconv"
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
	validate.RegisterValidation("credit_card_cvc", ValidateCreditCardCVC)
	validate.RegisterValidation("credit_card_expires_date_month", ValidateNotExpiredDateMonth)

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

func ValidateCreditCardCVC(fl validator.FieldLevel) bool {
	value := fl.Field().String()

	_, err := strconv.Atoi(value)
	if err != nil {
		return false
	}

	return len(value) == 3 || len(value) == 4
}

func ValidateNotExpiredDateMonth(fl validator.FieldLevel) bool {
	value := fl.Field().String()
	parsedTime, err := time_service.ParseDateMonthString(value)
	if err != nil {
		return false
	}

	if parsedTime.Before(time.Now()) {
		return false
	}

	return true
}
