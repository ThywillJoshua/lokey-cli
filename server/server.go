// server.go
package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"translate-cli/config"
)

func StartHTTPServer(cfg config.Configuration) {
	execPath, err := os.Executable()
	if err != nil {
		log.Fatalf("Error getting executable path: %v", err)
	}
	execDir := filepath.Dir(execPath)
	distPath := filepath.Join(execDir, "dist", "ui", "browser")
	i18nPath := filepath.Join(execDir, cfg.Config.FilesPath)

	fs := http.FileServer(http.Dir(distPath))
	http.Handle("/", fs)

	i18nFS := http.FileServer(http.Dir(i18nPath))
	http.Handle("/i18n/", http.StripPrefix("/i18n", i18nFS))

	http.HandleFunc("/close", closeHandler)
	fmt.Println("Starting server on http://localhost:8080/")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// func messageHandler(w http.ResponseWriter, _ *http.Request, message *string) {
// 	if err := json.NewEncoder(w).Encode(*message); err != nil {
// 		http.Error(w, "Error generating diff message", http.StatusInternalServerError)
// 	}
// }

func closeHandler(w http.ResponseWriter, r *http.Request) {
	os.Exit(0)
}

