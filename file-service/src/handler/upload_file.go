package handler

import (
	"fmt"
	"path"

	"os"

	"encoding/base64"

	"github.com/google/uuid"
)

const (
	Image = "image"
)

func UploadFile(event *UploadFileEvent) (map[string]string, error) {
	fileExtension, err := getFileExtension(event.Type)
	if err != nil {
		return nil, err
	}

	filename := uuid.New()
	fullFilename := filename.String() + "." + fileExtension

	fileBuffer, err := base64.StdEncoding.DecodeString(event.Data)
	if err != nil {
		return nil, err
	}

	writeFile(fileBuffer, fullFilename)

	return map[string]string{"filename": fullFilename}, nil
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
