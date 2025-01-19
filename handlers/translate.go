package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
)

type TranslationRequest struct {
	From      string            `json:"from"`
	To        string            `json:"to"`
	KeyValues map[string]string `json:"keyValues"`
}

type TranslationResponse struct {
	TranslatedKeyValues map[string]string `json:"translatedKeyValues"`
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

	// Initialize the LLM
	llm, err := ollama.New(ollama.WithModel("mistral"))
	if err != nil {
		http.Error(w, "Failed to initialize LLM", http.StatusInternalServerError)
		log.Printf("LLM initialization error: %v", err)
		return
	}

	// Context for LLM requests
	ctx := context.Background()

	// Translate each value while keeping keys unchanged
	translated := make(map[string]string)
	for key, value := range req.KeyValues {
		prompt := fmt.Sprintf(`
		Translate the following text from %s to %s. Return only the translated text:
		"%s"
		`, req.From, req.To, value)

		// Generate translation using the LLM
		completion, err := llms.GenerateFromSinglePrompt(ctx, llm, prompt)
		if err != nil {
			http.Error(w, fmt.Sprintf("Translation failed for key '%s'", key), http.StatusInternalServerError)
			log.Printf("Translation error for key '%s': %v", key, err)
			return
		}

		// Clean up the completion output
		cleaned := strings.TrimSpace(completion)
		if idx := strings.Index(cleaned, "\n"); idx != -1 {
			cleaned = cleaned[:idx] // Take only the first line if there's extra text
		}

		translated[key] = cleaned
	}

	// Construct and send the response
	resp := TranslationResponse{
		TranslatedKeyValues: translated,
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		log.Printf("Response encoding error: %v", err)
	}
}