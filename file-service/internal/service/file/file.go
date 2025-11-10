package file_service

import (
	config_service "go-file-server/internal/service/config"
	"os"
	"path"
)

func WriteFile(data []byte, filename string) error {
	staticDirPath := config_service.GetConfig().StaticDirPath

	err := ensureDir(staticDirPath)
	if err != nil {
		return err
	}

	err = os.WriteFile(path.Join(staticDirPath, filename), data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func ensureDir(path string) error {
	err := os.MkdirAll(path, 0770)
	if err != nil && !os.IsExist(err) {
		return err
	}

	return nil
}

func DeleteFile(filename string) error {
	staticDirPath := config_service.GetConfig().StaticDirPath

	_, err := os.Stat(path.Join(staticDirPath, filename))
	if err != nil {
		return err
	}

	err = os.Remove(path.Join(staticDirPath, filename))
	if err != nil {
		return err
	}

	return nil
}
