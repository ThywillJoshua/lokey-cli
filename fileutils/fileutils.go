package fileutils

import (
	"fmt"
	"os"
	"path/filepath"
	"translate-cli/config"
)

// CreateFiles creates files with empty JSON objects in the specified directory
func CreateFiles(cfg config.Configuration, filenames ...string) error {
	for _, filename := range filenames {
		filePath := filepath.Join(cfg.Config.FilesPath, filename)

		file, err := os.Create(filePath)
		if err != nil {
			return fmt.Errorf("error creating file %s: %v", filePath, err)
		}
		defer file.Close()

		_, err = file.WriteString("{}")
		if err != nil {
			return fmt.Errorf("error writing to file %s: %v", filePath, err)
		}

		fmt.Printf("Created file: %s\n", filePath)
	}

	return nil
}

// SyncFiles synchronizes JSON files with the default file
func SyncFiles(cfg config.Configuration) {
	// (Sync logic here)
}
