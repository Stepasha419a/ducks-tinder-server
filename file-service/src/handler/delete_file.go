package handler

import (
	"errors"
	"fmt"
	"os"
	"path"
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
	if _, err := os.Stat(path.Join("static", req.Filename)); errors.Is(err, os.ErrNotExist) {
		return nil, fmt.Errorf("not found")
	}

	e := os.Remove(path.Join("static", req.Filename))
	if e != nil {
		panic(e)
	}

	return &DeleteFileResponse{Filename: req.Filename}, nil
}
