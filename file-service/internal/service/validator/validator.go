package validator_service

import (
	"log"

	"github.com/go-playground/validator/v10"
)

type ValidatorService struct {
	validate *validator.Validate
}

func NewValidatorService() *ValidatorService {
	log.Println("new validator service")

	validate := validator.New()

	return &ValidatorService{
		validate,
	}
}
