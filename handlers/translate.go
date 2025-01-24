package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"

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

	// Initialize the LLM
	llm, err := ollama.New(ollama.WithModel("mistral"))
	if err != nil {
		http.Error(w, "Failed to initialize LLM", http.StatusInternalServerError)
		log.Printf("LLM initialization error: %v", err)
		return
	}

	// Context for LLM requests
	ctx := context.Background()

	// Translation results and error tracking
	translated := make(map[string]string)
	errors := make(map[string]string)

	// Use a WaitGroup and mutex for concurrency
	var wg sync.WaitGroup
	var mutex sync.Mutex

	for key, value := range req.KeyValues {
		wg.Add(1)

		go func(key, value string) {
			defer wg.Done()

			prompt := fmt.Sprintf(
				"Translate the following text from %s to %s. Only return the translated text:\n\"%s\"",
				req.From, req.To, value,
			)

			// Generate translation using the LLM
			completion, err := llms.GenerateFromSinglePrompt(ctx, llm, prompt)
			if err != nil {
				mutex.Lock()
				errors[key] = fmt.Sprintf("Translation failed: %v", err)
				mutex.Unlock()
				log.Printf("Translation error for key '%s': %v", key, err)
				return
			}

			// Clean up the output
			cleaned := strings.TrimSpace(completion)
			if idx := strings.Index(cleaned, "\n"); idx != -1 {
				cleaned = cleaned[:idx] // Take only the first line if there's extra text
			}

			// Store the result
			mutex.Lock()
			translated[key] = cleaned
			mutex.Unlock()
		}(key, value)
	}

	// Wait for all goroutines to finish
	wg.Wait()

	// Prepare the response
	resp := TranslationResponse{
		TranslatedKeyValues: translated,
	}

	if len(errors) > 0 {
		resp.Errors = errors
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
