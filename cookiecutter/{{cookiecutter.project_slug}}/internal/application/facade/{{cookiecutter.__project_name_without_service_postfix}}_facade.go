package facade

import (
	"{{cookiecutter.module_name}}/internal/application/mapper"
	get_{{cookiecutter.entity}} "{{cookiecutter.module_name}}/internal/application/query/get_{{cookiecutter.entity}}"
	service_context "{{cookiecutter.module_name}}/internal/application/service/context"
	"{{cookiecutter.module_name}}/internal/domain/repository"
)

type {{cookiecutter.__project_name_without_service_postfix_camel_case}}Facade struct {
	{{cookiecutter.__entity_low_camel_case}}Repository repository.{{cookiecutter.__entity_camel_case}}Repository
}

func New{{cookiecutter.__project_name_without_service_postfix_camel_case}}Facade({{cookiecutter.__entity_low_camel_case}}Repository repository.{{cookiecutter.__entity_camel_case}}Repository) *{{cookiecutter.__project_name_without_service_postfix_camel_case}}Facade {
	return &{{cookiecutter.__project_name_without_service_postfix_camel_case}}Facade{ {{cookiecutter.__entity_low_camel_case}}Repository}
}

func (f *{{cookiecutter.__project_name_without_service_postfix_camel_case}}Facade) Get{{cookiecutter.__entity_camel_case}}(ctx service_context.ServiceContext[*mapper.{{cookiecutter.__entity_camel_case}}Response], query *get_{{cookiecutter.entity}}.Get{{cookiecutter.__entity_camel_case}}Query) error {
	return get_{{cookiecutter.entity}}.Get{{cookiecutter.__entity_camel_case}}QueryHandler(ctx, query, f.{{cookiecutter.__entity_low_camel_case}}Repository)
}
