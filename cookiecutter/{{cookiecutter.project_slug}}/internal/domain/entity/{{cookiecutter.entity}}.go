package entity

import (
	"time"

	"github.com/google/uuid"
)

type {{cookiecutter.__entity_camel_case}} struct {
	Id       string
	Property string
	
	CreatedAt time.Time
	UpdatedAt time.Time
}

func New{{cookiecutter.__entity_camel_case}}(property string) *{{cookiecutter.__entity_camel_case}} {
	return &{{cookiecutter.__entity_camel_case}}{
		Id:       uuid.New().String(),
		Property: property,

		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}
