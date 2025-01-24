// server.go
package server

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"translate-cli/handlers"
)

// Embed static files
//go:embed static/browser
var static embed.FS

func StartHTTPServer() {
	webapp, err := fs.Sub(static, "static/browser")
	if err != nil {
		fmt.Println(err)
	}

	http.Handle("/", http.FileServer(http.FS(webapp)))

    http.HandleFunc("GET /files/", handlers.GetFiles)

	http.HandleFunc("GET /config/", handlers.GetConfig)

	http.HandleFunc("POST /translate/", handlers.Translate)

	http.HandleFunc("POST /batchTranslate/", handlers.BatchTranslate)

	http.HandleFunc("GET /close/", handlers.CloseApp)

	http.HandleFunc("PUT /deleteKeys/", handlers.DeleteKeys)

	http.HandleFunc("PUT /updateKey/", handlers.UpdateKey)

	http.HandleFunc("PUT /updateValue/", handlers.UpdateValue)
	
	fmt.Println("Starting server on http://localhost:8080/")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

