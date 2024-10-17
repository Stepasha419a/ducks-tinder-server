package {{cookiecutter.__project_name_without_service_postfix_underline}}_controller

import (
	"{{cookiecutter.module_name}}/internal/application/mapper"
	"{{cookiecutter.module_name}}/internal/application/service"
	validator_service "{{cookiecutter.module_name}}/internal/domain/service/validator"
	interface_common "{{cookiecutter.module_name}}/internal/interface/common"
	fiber_impl_context "{{cookiecutter.module_name}}/internal/interface/http/fiber/context"
	"net/http"

	"github.com/gofiber/fiber/v3"
)

type {{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller struct {
	service          service.{{cookiecutter.__project_name_without_service_postfix_camel_case}}Service
	validatorService validator_service.ValidatorService
}

func New{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller(f *fiber.App, service service.{{cookiecutter.__project_name_without_service_postfix_camel_case}}Service, validatorService validator_service.ValidatorService) *{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller {
	controller := &{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller{
		service,
		validatorService,
	}

	f.Get("/{{cookiecutter.__project_name_without_service_postfix_low_camel_case}}/{{cookiecutter.entity}}", controller.Get{{cookiecutter.__entity_camel_case}})

	return controller
}

func (bc *{{cookiecutter.__project_name_without_service_postfix_camel_case}}Controller) Get{{cookiecutter.__entity_camel_case}}(ctx fiber.Ctx) error {
	rawUserId := ctx.Locals("userId")

	_, ok := rawUserId.(string)
	if !ok {
		return fiber.NewError(http.StatusInternalServerError, "Undefined userId")
	}

	dto := new(interface_common.Get{{cookiecutter.__entity_camel_case}}Dto)

	err := ctx.Bind().Body(dto)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber_impl_context.BadRequest)
	}

	query, err := dto.ToGet{{cookiecutter.__entity_camel_case}}Query(bc.validatorService)
	if err != nil {
		return fiber.NewError(http.StatusBadRequest, "Validation failed: "+err.Error())
	}

	serviceContext := fiber_impl_context.NewServiceContext[*mapper.{{cookiecutter.__entity_camel_case}}Response](ctx)
	return bc.service.Get{{cookiecutter.__entity_camel_case}}(serviceContext, query)
}
