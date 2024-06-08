package grpc_service

import (
	"context"
	"go-file-server/proto/gen"
	"go-file-server/src/handler"
)

type FileServiceServerImpl struct {
	gen.UnimplementedFileServiceServer
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
