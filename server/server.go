// server.go
package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"translate-cli/globals"
)

func StartHTTPServer() {
	execPath, err := os.Executable()
	if err != nil {
		log.Fatalf("Error getting executable path: %v", err)
	}
	execDir := filepath.Dir(execPath)
	distPath := filepath.Join(execDir, "dist", "ui", "browser")
	
	fs := http.FileServer(http.Dir(distPath))
	http.Handle("/", fs)

    http.HandleFunc("GET /i18n/", func (w http.ResponseWriter, r *http.Request) {
		files, err := getAllFiles(globals.ConfigData.Config.FilesPath)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to list files: %v", err), http.StatusInternalServerError)
			return
		}
	
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(files); err != nil {
			http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
		}
	})

	http.HandleFunc("GET /config/", func (w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(globals.ConfigData.Config); err != nil {
			http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/close", closeHandler)
	fmt.Println("Starting server on http://localhost:8080/")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func closeHandler(w http.ResponseWriter, r *http.Request) {
	os.Exit(0)
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