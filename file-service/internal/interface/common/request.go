package interface_common

import (
	"go-file-server/internal/handler"
	validator_service "go-file-server/internal/service/validator"
)

type UploadFileDto struct {
	Data []byte `validate:"required"`
	Type string `validate:"required"`
}

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

type DeleteFileDto struct {
	Filename string `validate:"required"`
}

func (dto *DeleteFileDto) ToDeleteFileRequest(validatorService *validator_service.ValidatorService) (*handler.DeleteFileRequest, error) {
	err := validatorService.Struct(dto)
	if err != nil {
		return nil, err
	}

	return &handler.DeleteFileRequest{
		Filename: dto.Filename,
	}, nil
}
