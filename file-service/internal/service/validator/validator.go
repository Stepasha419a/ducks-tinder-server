package validator_service

import (
	"github.com/go-playground/validator/v10"
)

type ValidatorService struct {
	validate *validator.Validate
}
