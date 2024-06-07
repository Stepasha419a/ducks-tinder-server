package grpc_service

import (
	"context"
	"fmt"
	"go-file-server/proto/gen"
	"go-file-server/src/handler"
	"log"
	"net"
	"os"
	"strconv"

	"google.golang.org/grpc"
)

func Init() {
	server := grpc.NewServer()

	fileServer := FileServiceServerImpl{}

	gen.RegisterFileServiceServer(server, &fileServer)

	PORT := os.Getenv("GRPC_PORT")

	con, err := net.Listen("tcp", fmt.Sprintf(":%s", PORT))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	INT_PORT, _ := strconv.Atoi(PORT)
	log.Printf("gRPC server listening on port %d", INT_PORT)
	if err := server.Serve(con); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

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
