package handlers

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type TranslationRequest struct {
	From      string            `json:"from"`
	To        string            `json:"to"`
	KeyValues map[string]string `json:"keyValues"`
}

type TranslationResponse struct {
	TranslatedKeyValues map[string]string `json:"translatedKeyValues"`
	Errors              map[string]string `json:"errors,omitempty"`
}

func Translate(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var req TranslationRequest
	if err := json.Unmarshal(body, &req); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.From == "" || req.To == "" || len(req.KeyValues) == 0 {
		http.Error(w, "Invalid request: 'from', 'to', and 'keyValues' fields are required", http.StatusBadRequest)
		return
	}

	// Process the translation
	ctx := context.Background()
	translated, errors := processTranslation(ctx, req.From, req.To, req.KeyValues)

	// Prepare the response
	resp := TranslationResponse{
		TranslatedKeyValues: translated,
		Errors:              errors,
	}

	if len(errors) > 0 {
		w.WriteHeader(http.StatusPartialContent)
	} else {
		w.WriteHeader(http.StatusOK)
	}

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		log.Printf("Response encoding error: %v", err)
	}
}
