package handlers

import (
	"net/http"
	"os"
)

func CloseApp(w http.ResponseWriter, r *http.Request) {
	os.Exit(0)
}