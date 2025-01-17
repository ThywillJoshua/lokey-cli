package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"translate-cli/globals"
)

func CloseApp(w http.ResponseWriter, r *http.Request) {
	os.Exit(0)
}

func GetConfig (w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(globals.ConfigData.Config); err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}

func GetFiles (w http.ResponseWriter, r *http.Request) {
	files, err := getAllFiles(globals.ConfigData.Config.FilesPath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to list files: %v", err), http.StatusInternalServerError)
		return
	}

	var result []map[string]interface{}

	for _, file := range files {
		filePath := filepath.Join(globals.ConfigData.Config.FilesPath, file)
		content, err := os.ReadFile(filePath)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to read file %s: %v", file, err), http.StatusInternalServerError)
			return
		}

		var jsonContent interface{}
		if err := json.Unmarshal(content, &jsonContent); err != nil {
			http.Error(w, fmt.Sprintf("Failed to parse JSON content in file %s: %v", file, err), http.StatusInternalServerError)
			return
		}

		result = append(result, map[string]interface{}{
			"fileName": file,
			"content": jsonContent,
		})
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