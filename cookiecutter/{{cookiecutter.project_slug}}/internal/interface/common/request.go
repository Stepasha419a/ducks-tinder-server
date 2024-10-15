package interface_common

import (
	get_{{cookiecutter.__entity_low_camel_case}} "{{cookiecutter.module_name}}/internal/application/query/get_{{cookiecutter.__entity_low_camel_case}}"
	validator_service "{{cookiecutter.module_name}}/internal/domain/service/validator"
)

type Get{{cookiecutter.__entity_camel_case}}Dto struct {
	Id string `validate:"required,uuid4"`
}

func (dto *Get{{cookiecutter.__entity_camel_case}}Dto) ToGet{{cookiecutter.__entity_camel_case}}Query(validatorService validator_service.ValidatorService) (*get_{{cookiecutter.__entity_low_camel_case}}.Get{{cookiecutter.__entity_camel_case}}Query, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &get_{{cookiecutter.__entity_low_camel_case}}.Get{{cookiecutter.__entity_camel_case}}Query{
		Id: dto.Id,
	}, nil
}
