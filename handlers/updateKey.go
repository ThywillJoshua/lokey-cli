package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"translate-cli/globals"
)

type UpdateKeyRequest struct {
	NewKey   string `json:"newKey"`
	PrevKey  string `json:"prevKey"`
}

func UpdateKey(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var req UpdateKeyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate request fields
	if strings.TrimSpace(req.NewKey) == "" || strings.TrimSpace(req.PrevKey) == "" {
		http.Error(w, "NewKey and PrevKey cannot be empty", http.StatusBadRequest)
		return
	}

	// Get all JSON files in the directory
	files, err := getAllFiles(globals.ConfigData.Config.FilesPath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to list files: %v", err), http.StatusInternalServerError)
		return
	}

	// Track errors for individual files
	var failedFiles []string

	for _, file := range files {
		// Construct the file path
		filePath := filepath.Join(globals.ConfigData.Config.FilesPath, file)

		// Read the file content
		content, err := os.ReadFile(filePath)
		if err != nil {
			failedFiles = append(failedFiles, fmt.Sprintf("Failed to read file %s: %v", file, err))
			continue
		}

		// Parse JSON content
		var jsonContent map[string]interface{}
		if err := json.Unmarshal(content, &jsonContent); err != nil {
			failedFiles = append(failedFiles, fmt.Sprintf("Failed to parse JSON in file %s: %v", file, err))
			continue
		}

		// Rename the key
		renameNestedKey(jsonContent, req.PrevKey, req.NewKey)

		// Write the updated content back to the file
		updatedContent, err := json.MarshalIndent(jsonContent, "", "  ")
		if err != nil {
			failedFiles = append(failedFiles, fmt.Sprintf("Failed to serialize JSON for file %s: %v", file, err))
			continue
		}

		if err := os.WriteFile(filePath, updatedContent, 0644); err != nil {
			failedFiles = append(failedFiles, fmt.Sprintf("Failed to write updated file %s: %v", file, err))
		}
	}

	// Prepare the response
	if len(failedFiles) > 0 {
		w.WriteHeader(http.StatusPartialContent)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"message":      "Some keys were not updated successfully",
			"failedFiles":  failedFiles,
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("Key updated successfully"))
}

func renameNestedKey(data map[string]interface{}, prevKey string, newKey string) {
	keys := strings.Split(prevKey, ".")
	for i, k := range keys {
		if i == len(keys)-1 {
			if value, exists := data[k]; exists {
				delete(data, k)
				data[newKey] = value
			}
			return
		}

		// Check if the current key is a nested map
		if nested, ok := data[k].(map[string]interface{}); ok {
			data = nested
		} else {
			// Exit if the structure doesn't match
			return
		}
	}
}
