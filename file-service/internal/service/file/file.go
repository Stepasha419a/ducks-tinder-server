package file_service

import (
	"os"
)

func ensureDir(path string) error {
	err := os.MkdirAll(path, 0770)
	if err != nil && !os.IsExist(err) {
		return err
	}

	return nil
}
