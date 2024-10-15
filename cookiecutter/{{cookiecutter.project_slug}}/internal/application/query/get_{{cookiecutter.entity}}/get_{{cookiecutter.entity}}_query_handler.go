package get_{{cookiecutter.entity}}

import (
	"{{cookiecutter.module_name}}/internal/application/mapper"
	service_context "{{cookiecutter.module_name}}/internal/application/service/context"
	"{{cookiecutter.module_name}}/internal/domain/repository"
	"net/http"
)

func Get{{cookiecutter.__entity_camel_case}}QueryHandler(ctx service_context.ServiceContext[*mapper.{{cookiecutter.__entity_camel_case}}Response], query *Get{{cookiecutter.__entity_camel_case}}Query, {{cookiecutter.__entity_low_camel_case}}Repository repository.{{cookiecutter.__entity_repository}}) error {
	{{cookiecutter.__entity_low_camel_case}}, err := {{cookiecutter.__entity_low_camel_case}}Repository.Find(ctx.Context(), query.Id, nil)
	if err != nil {
		return err
	}

	if {{cookiecutter.__entity_low_camel_case}} == nil {
		return ctx.NotFound()
	}

	return ctx.Response(http.StatusOK, mapper.New{{cookiecutter.__entity_camel_case}}Response({{cookiecutter.__entity_low_camel_case}}))
}
