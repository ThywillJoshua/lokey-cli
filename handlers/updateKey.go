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
	Filename string `json:"filename"`
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

	// Construct the file path
	filePath := filepath.Join(globals.ConfigData.Config.FilesPath, req.Filename)

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

	// Rename the key
	renameNestedKey(jsonContent, req.PrevKey, req.NewKey)

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

	w.WriteHeader(http.StatusOK)
	if _, err := w.Write([]byte("Key updated successfully")); err != nil {
		http.Error(w, "Failed to write response", http.StatusInternalServerError)
	}
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

		if nested, ok := data[k].(map[string]interface{}); ok {
			data = nested
		} else {
			return
		}
	}
}
