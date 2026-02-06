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
	res, err := handler.UploadFile(&handler.UploadFileRequest{Data: req.Data, Type: req.Type})
	if err != nil {
		return nil, err
	}

	return &gen.UploadFileResponse{Filename: res.Filename}, nil
}

func (f *FileServiceServerImpl) DeleteFile(context context.Context, req *gen.DeleteFileRequest) (*gen.DeleteFileResponse, error) {
	res, err := handler.DeleteFile(&handler.DeleteFileRequest{Filename: req.Filename})
	if err != nil {
		return nil, err
	}

	return &gen.DeleteFileResponse{Filename: res.Filename}, nil
}
