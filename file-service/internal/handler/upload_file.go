package handler

import (
	"fmt"
	file_service "go-file-server/internal/service/file"

	"github.com/google/uuid"
)

const (
	Image = "image"
)

type (
	UploadFileRequest struct {
		Data []byte `json:"data"`
		Type string `json:"type"`
	}

	UploadFileResponse struct {
		Filename string `json:"filename"`
	}
)

func UploadFile(req *UploadFileRequest) (*UploadFileResponse, error) {
	if !isValidFileType(req.Type) {
		return nil, fmt.Errorf("failed to upload file: wrong file type")
	}

	webpData, err := image_service.ConvertToWebP(req.Data)
	if err != nil {
		return nil, fmt.Errorf("failed to upload file: failed to convert to webp, %w", err)
	}

	filename := uuid.New()
	fullFilename := filename.String() + "." + fileExtension

	err = file_service.WriteFile(req.Data, fullFilename)
	if err != nil {
		return nil, fmt.Errorf("failed to upload file, %w", err)
	}

	return &UploadFileResponse{Filename: fullFilename}, nil
}

func isValidFileType(dataType string) bool {
	if dataType == Image {
		return true
	}

	return false
}
