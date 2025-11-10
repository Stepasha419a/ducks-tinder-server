package handler

import (
	"fmt"
	file_service "go-file-server/internal/service/file"
	"os"
)

type (
	DeleteFileRequest struct {
		Filename string `json:"filename"`
	}

	DeleteFileResponse struct {
		Filename string `json:"filename"`
	}
)

func DeleteFile(req *DeleteFileRequest) (*DeleteFileResponse, error) {
	err := file_service.DeleteFile(req.Filename)
	if os.IsNotExist(err) {
		return nil, fmt.Errorf("not found, %w", err)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to delete file, %w", err)
	}

	return &DeleteFileResponse{Filename: req.Filename}, nil
}
