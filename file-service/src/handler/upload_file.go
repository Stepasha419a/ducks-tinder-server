package handler

import (
	"fmt"
	"log"
	"path"

	"os"

	"github.com/google/uuid"
)

const (
	Image = "image"
)

func HandleUploadFile(event *UploadFile) string {
	fileExtension, err := getFileExtension(event.Type)
	if err != nil {
		log.Fatal("not implemented data type")
		return ""
	}

	fileName := writeFile([]byte(event.Data), fileExtension)

	return fileName
}

func getFileExtension(dataType string) (string, error) {
	if dataType == Image {
		return "jpg", nil
	}

	return "", fmt.Errorf("invalid data type")
}

func writeFile(buffer []byte, fileExtension string) string {
	writeDir()

	fileName := uuid.New()

	fullFileName := fileName.String() + "." + fileExtension

	err := os.WriteFile(path.Join("static", fullFileName), buffer, 0644)
	if err != nil {
		panic(err)
	}

	return fullFileName
}

func writeDir() {
	if _, err := os.Stat("static"); err != nil {
		if os.IsNotExist(err) {
			if err := os.Mkdir("static", 0770); err != nil {
				panic(err)
			}
		}
	}
}
