package handler

import (
	"fmt"
	"path"

	"os"

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
	fileExtension, err := getFileExtension(req.Type)
	if err != nil {
		return nil, err
	}

	filename := uuid.New()
	fullFilename := filename.String() + "." + fileExtension

	//fileBuffer, err := base64.StdEncoding.DecodeString(req.Data)
	if err != nil {
		return nil, err
	}

	writeFile(req.Data, fullFilename)

	return &UploadFileResponse{Filename: fullFilename}, nil
}

func getFileExtension(dataType string) (string, error) {
	if dataType == Image {
		return "jpg", nil
	}

	return "", fmt.Errorf("invalid data type")
}

func writeFile(data []byte, filename string) {
	writeDir()

	err := os.WriteFile(path.Join("static", filename), data, 0644)
	if err != nil {
		panic(err)
	}
}

func writeDir() {
	_, err := os.Stat("static")
	if err != nil {
		if err := os.Mkdir("static", 0770); err != nil {
			panic(err)
		}
	}
}
