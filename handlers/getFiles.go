package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"translate-cli/globals"
)

func GetFiles(w http.ResponseWriter, r *http.Request) {
	files, err := getAllFiles(globals.ConfigData.Config.FilesPath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to list files: %v", err), http.StatusInternalServerError)
		return
	}

	var wg sync.WaitGroup
	resultChan := make(chan map[string]interface{}, len(files))
	errChan := make(chan error, len(files))

	for _, file := range files {
		wg.Add(1)

		go func(file string) {
			defer wg.Done()

			filePath := filepath.Join(globals.ConfigData.Config.FilesPath, file)
			content, err := os.ReadFile(filePath)
			if err != nil {
				errChan <- fmt.Errorf("failed to read file %s: %v", file, err)
				return
			}

			var jsonContent interface{}
			if err := json.Unmarshal(content, &jsonContent); err != nil {
				errChan <- fmt.Errorf("failed to parse JSON content in file %s: %v", file, err)
				return
			}

			resultChan <- map[string]interface{}{
				"fileName": file,
				"content":  jsonContent,
			}
		}(file)
	}

	go func() {
		wg.Wait()
		close(resultChan)
		close(errChan)
	}()

	var result []map[string]interface{}
	for r := range resultChan {
		result = append(result, r)
	}
	for e := range errChan {
		http.Error(w, e.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}

func getAllFiles(dirPath string) ([]string, error) {
	var files []string
	err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && filepath.Ext(path) == ".json" {
			files = append(files, filepath.Base(path))
		}
		return nil
	})
	return files, err
}
