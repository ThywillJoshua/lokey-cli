package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"translate-cli/globals"
)

type DeleteKeysRequest struct {
	Keys []string `json:"keys"`
}

func DeleteKeys(w http.ResponseWriter, r *http.Request) {
	// Parse the request body to get the keys to delete
	var req DeleteKeysRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if len(req.Keys) == 0 {
		http.Error(w, "No keys provided", http.StatusBadRequest)
		return
	}

	// Get all JSON files in the directory
	files, err := getAllFiles(globals.ConfigData.Config.FilesPath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to list files: %v", err), http.StatusInternalServerError)
		return
	}

	for _, file := range files {
		filePath := filepath.Join(globals.ConfigData.Config.FilesPath, file)

		// Read the file content
		content, err := os.ReadFile(filePath)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to read file %s: %v", file, err), http.StatusInternalServerError)
			return
		}

		// Parse JSON content
		var jsonContent map[string]interface{}
		if err := json.Unmarshal(content, &jsonContent); err != nil {
			http.Error(w, fmt.Sprintf("Failed to parse JSON content in file %s: %v", file, err), http.StatusInternalServerError)
			return
		}

		// Delete the specified keys from the JSON content, including nested keys
		for _, key := range req.Keys {
			deleteNestedKey(jsonContent, strings.Split(key, "."))
		}

		// Write the updated content back to the file
		updatedContent, err := json.MarshalIndent(jsonContent, "", "  ")
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to serialize updated JSON for file %s: %v", file, err), http.StatusInternalServerError)
			return
		}

		if err := os.WriteFile(filePath, updatedContent, 0644); err != nil {
			http.Error(w, fmt.Sprintf("Failed to write updated file %s: %v", file, err), http.StatusInternalServerError)
			return
		}
	}

	if err := json.NewEncoder(w).Encode("Keys deleted successfully"); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		log.Printf("Error deleting keys : %v", err)
	}
}

func deleteNestedKey(data map[string]interface{}, keys []string) {
	if len(keys) == 0 {
		return
	}

	key := keys[0]
	if len(keys) == 1 {
		delete(data, key)
		return
	}

	if nested, ok := data[key].(map[string]interface{}); ok {
		deleteNestedKey(nested, keys[1:])
		// Remove the parent key if it's now empty
		if len(nested) == 0 {
			delete(data, key)
		}
	}
}
