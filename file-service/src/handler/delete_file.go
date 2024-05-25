package handler

import (
	"errors"
	"fmt"
	"os"
	"path"
)

func DeleteFile(event *DeleteFileEvent) error {
	if _, err := os.Stat(path.Join("static", event.Filename)); errors.Is(err, os.ErrNotExist) {
		return fmt.Errorf("not found")
	}

	e := os.Remove(path.Join("static", event.Filename))
	if e != nil {
		panic(e)
	}

	return nil
}
