package handlers

import (
	"encoding/json"
	"lokey-cli/globals"
	"net/http"
)

func GetConfig (w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(globals.ConfigData.Config); err != nil {
		http.Error(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}