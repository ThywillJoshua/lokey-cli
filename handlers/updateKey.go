package handlers

import (
	"encoding/json"
	"fmt"
	"lokey-cli/globals"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

type UpdateKeyRequest struct {
	NewKey  string `json:"newKey"`
	PrevKey string `json:"prevKey"`
}

func UpdateKey(w http.ResponseWriter, r *http.Request) {
	var req UpdateKeyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.NewKey) == "" || strings.TrimSpace(req.PrevKey) == "" {
		http.Error(w, "NewKey and PrevKey cannot be empty", http.StatusBadRequest)
		return
	}

	files, err := getAllFiles(globals.ConfigData.Config.FilesPath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to list files: %v", err), http.StatusInternalServerError)
		return
	}

	var wg sync.WaitGroup
	failedFilesChan := make(chan string, len(files))
	successChan := make(chan string, len(files))

	for _, file := range files {
		wg.Add(1)

		go func(file string) {
			defer wg.Done()

			filePath := filepath.Join(globals.ConfigData.Config.FilesPath, file)

			content, err := os.ReadFile(filePath)
			if err != nil {
				failedFilesChan <- fmt.Sprintf("Failed to read file %s: %v", file, err)
				return
			}

			var jsonContent map[string]interface{}
			if err := json.Unmarshal(content, &jsonContent); err != nil {
				failedFilesChan <- fmt.Sprintf("Failed to parse JSON in file %s: %v", file, err)
				return
			}

			if !renameNestedKey(jsonContent, req.PrevKey, req.NewKey) {
				failedFilesChan <- fmt.Sprintf("Key %s not found in file %s", req.PrevKey, file)
				return
			}

			updatedContent, err := json.MarshalIndent(jsonContent, "", "  ")
			if err != nil {
				failedFilesChan <- fmt.Sprintf("Failed to serialize JSON for file %s: %v", file, err)
				return
			}

			if err := os.WriteFile(filePath, updatedContent, 0644); err != nil {
				failedFilesChan <- fmt.Sprintf("Failed to write updated file %s: %v", file, err)
				return
			}

			successChan <- file
		}(file)
	}

	go func() {
		wg.Wait()
		close(failedFilesChan)
		close(successChan)
	}()

	var failedFiles []string
	var updatedFiles []string

	for f := range failedFilesChan {
		failedFiles = append(failedFiles, f)
	}

	for s := range successChan {
		updatedFiles = append(updatedFiles, s)
	}

	w.Header().Set("Content-Type", "application/json")
	if len(failedFiles) > 0 {
		w.WriteHeader(http.StatusPartialContent)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"message":      "Some keys were not updated successfully",
			"failedFiles":  failedFiles,
			"updatedFiles": updatedFiles,
		})
	} else {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"message":      "All keys updated successfully",
			"updatedFiles": updatedFiles,
		})
	}
}

func renameNestedKey(data map[string]interface{}, prevKey string, newKey string) bool {
	keys := strings.Split(prevKey, ".")
	for i, k := range keys {
		if i == len(keys)-1 {
			if value, exists := data[k]; exists {
				delete(data, k)
				data[newKey] = value
				return true
			}
			return false
		}

		if nested, ok := data[k].(map[string]interface{}); ok {
			data = nested
		} else {
			return false
		}
	}
	return false
}