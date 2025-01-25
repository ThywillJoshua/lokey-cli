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

type UpdateValueRequest struct {
	Filename string `json:"filename"`
	Key      string `json:"key"`
	NewValue string `json:"newValue"`
}

func UpdateValue(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var req UpdateValueRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate the request fields
	if err := validateUpdateValueRequest(req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Construct the file path
	filePath := filepath.Join(globals.ConfigData.Config.FilesPath, req.Filename)

	// Check if the path points to a valid file
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to access file %s: %v", req.Filename, err), http.StatusInternalServerError)
		return
	}

	if fileInfo.IsDir() {
		http.Error(w, fmt.Sprintf("Path %s is a directory, not a file", filePath), http.StatusBadRequest)
		return
	}

	// Read the file content
	content, err := os.ReadFile(filePath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to read file %s: %v", req.Filename, err), http.StatusInternalServerError)
		return
	}

	// Parse JSON content
	var jsonContent map[string]interface{}
	if err := json.Unmarshal(content, &jsonContent); err != nil {
		http.Error(w, fmt.Sprintf("Failed to parse JSON content in file %s: %v", req.Filename, err), http.StatusInternalServerError)
		return
	}

	// Update the specified key's value
	updateNestedKey(jsonContent, req.Key, req.NewValue)

	// Write the updated content back to the file
	updatedContent, err := json.MarshalIndent(jsonContent, "", "  ")
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to serialize updated JSON for file %s: %v", req.Filename, err), http.StatusInternalServerError)
		return
	}

	if err := os.WriteFile(filePath, updatedContent, 0644); err != nil {
		http.Error(w, fmt.Sprintf("Failed to write updated file %s: %v", req.Filename, err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode("Value updated successfully"); err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}

// Helper function to validate the request body
func validateUpdateValueRequest(req UpdateValueRequest) error {
	if strings.TrimSpace(req.Filename) == "" {
		return fmt.Errorf("filename cannot be empty")
	}
	if strings.TrimSpace(req.Key) == "" {
		return fmt.Errorf("key cannot be empty")
	}
	if strings.TrimSpace(req.NewValue) == "" {
		return fmt.Errorf("newValue cannot be empty")
	}
	return nil
}

func updateNestedKey(data map[string]interface{}, key string, newValue string) {
	keys := strings.Split(key, ".")
	for i, k := range keys {
		if i == len(keys)-1 {
			data[k] = newValue
			return
		}

		if nested, ok := data[k].(map[string]interface{}); ok {
			data = nested
		} else {
			return
		}
	}
}
