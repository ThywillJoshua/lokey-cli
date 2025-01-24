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

func processTranslation(ctx context.Context, llm *ollama.LLM, from string, to string, keyValues map[string]string) (map[string]string, map[string]string) {
	translated := make(map[string]string)
	errors := make(map[string]string)

	var mutex sync.Mutex
	var wg sync.WaitGroup

	for key, value := range keyValues {
		wg.Add(1)

		go func(key, value string) {
			defer wg.Done()

			prompt := fmt.Sprintf(
				"Translate the following text from %s to %s. Only return the translated text:\n\"%s\"",
				from, to, value,
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

	return translated, errors
}


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

	// Process the translation
	ctx := context.Background()
	translated, errors := processTranslation(ctx, llm, req.From, req.To, req.KeyValues)

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
