package service

import (
	"{{cookiecutter.module_name}}/internal/application/mapper"
	get_{{cookiecutter.entity}} "{{cookiecutter.module_name}}/internal/application/query/get_{{cookiecutter.entity}}"
	service_context "{{cookiecutter.module_name}}/internal/application/service/context"
)

type (
	{{cookiecutter.__project_name_camel_case}} interface {
		Get{{cookiecutter.__entity_camel_case}}(ctx service_context.ServiceContext[*mapper.{{cookiecutter.__entity_camel_case}}Response], query *get_{{cookiecutter.entity}}.Get{{cookiecutter.__entity_camel_case}}Query) error
	}
)
