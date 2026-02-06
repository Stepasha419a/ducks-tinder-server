package grpc_service

import (
	"context"
	"fmt"
	"go-file-server/internal/handler"
	interface_common "go-file-server/internal/interface/common"
	validator_service "go-file-server/internal/service/validator"
	"go-file-server/proto/gen"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type FileServiceServerImpl struct {
	gen.UnimplementedFileServiceServer
	validatorService *validator_service.ValidatorService
}

func (f *FileServiceServerImpl) UploadFile(context context.Context, req *gen.UploadFileRequest) (*gen.UploadFileResponse, error) {
	dto := interface_common.UploadFileDto{Data: req.Data, Type: req.Type}

	request, err := dto.ToUploadFileRequest(f.validatorService)
	if err != nil {
		msg := err.Error()
		return nil, status.Error(codes.InvalidArgument, fmt.Sprintf("Bad request: %s", msg))
	}

	res, err := handler.UploadFile(request)
	if err != nil {
		return nil, err
	}

	return &gen.UploadFileResponse{Filename: res.Filename}, nil
}

func (f *FileServiceServerImpl) DeleteFile(context context.Context, req *gen.DeleteFileRequest) (*gen.DeleteFileResponse, error) {
	dto := interface_common.DeleteFileDto{Filename: req.Filename}

	request, err := dto.ToDeleteFileRequest(f.validatorService)
	if err != nil {
		msg := err.Error()
		return nil, status.Error(codes.InvalidArgument, fmt.Sprintf("Bad request: %s", msg))
	}

	res, err := handler.DeleteFile(request)
	if err != nil {
		return nil, err
	}

	return &gen.DeleteFileResponse{Filename: res.Filename}, nil
}
