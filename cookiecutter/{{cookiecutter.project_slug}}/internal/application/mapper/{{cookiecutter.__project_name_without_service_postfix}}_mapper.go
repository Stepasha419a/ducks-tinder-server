package mapper

import (
	"time"

	"{{cookiecutter.module_name}}/internal/domain/entity"
)

type {{cookiecutter.__entity_camel_case}}Response struct {
	Id       string    `json:"id"`
	Property string    `json:"property"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func New{{cookiecutter.__entity_camel_case}}Response({{cookiecutter.__entity_low_camel_case}} *entity.{{cookiecutter.__entity_camel_case}}) *{{cookiecutter.__entity_camel_case}}Response {
	return &{{cookiecutter.__entity_camel_case}}Response{
		Id:        {{cookiecutter.__entity_low_camel_case}}.Id,
		Property:  {{cookiecutter.__entity_low_camel_case}}.Property,
		CreatedAt: {{cookiecutter.__entity_low_camel_case}}.CreatedAt,
		UpdatedAt: {{cookiecutter.__entity_low_camel_case}}.UpdatedAt,
	}
}
