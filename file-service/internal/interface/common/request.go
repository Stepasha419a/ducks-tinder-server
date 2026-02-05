package interface_common

import (
	"go-file-server/internal/handler"
	validator_service "go-file-server/internal/service/validator"
)

func (dto *UploadFileDto) ToUploadFileRequest(validatorService *validator_service.ValidatorService) (*handler.UploadFileRequest, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &handler.UploadFileRequest{
		Data: dto.Data,
		Type: dto.Type,
	}, nil
}

type UploadFileDto struct {
	Data []byte `validate:"required"`
	Type string `validate:"required"`
}

type DeleteFileDto struct {
	Filename string `validate:"required"`
}
