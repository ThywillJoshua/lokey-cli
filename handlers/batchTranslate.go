package handlers

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"sync"

	"github.com/tmc/langchaingo/llms/ollama"
)

type BatchTranslationRequest struct {
	Requests []TranslationRequest `json:"requests"`
}

type BatchTranslationResponse struct {
	Responses []TranslationResponse `json:"responses"`
}

func BatchTranslate(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var batchReq BatchTranslationRequest
	if err := json.Unmarshal(body, &batchReq); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	if len(batchReq.Requests) == 0 {
		http.Error(w, "Invalid request: 'requests' array cannot be empty", http.StatusBadRequest)
		return
	}

	// Initialize the LLM
	llm, err := ollama.New(ollama.WithModel("mistral"))
	if err != nil {
		http.Error(w, "Failed to initialize LLM", http.StatusInternalServerError)
		log.Printf("LLM initialization error: %v", err)
		return
	}

	ctx := context.Background()

	// Prepare the response array
	responses := make([]TranslationResponse, len(batchReq.Requests))

	// Use a WaitGroup for concurrency
	var wg sync.WaitGroup

	for i, req := range batchReq.Requests {
		wg.Add(1)

		go func(i int, req TranslationRequest) {
			defer wg.Done()

			translated, errors := processTranslation(ctx, llm, req.From, req.To, req.KeyValues)
			responses[i] = TranslationResponse{
				TranslatedKeyValues: translated,
				Errors:              errors,
			}
		}(i, req)
	}

	// Wait for all goroutines to finish
	wg.Wait()

	// Send the aggregated response
	resp := BatchTranslationResponse{
		Responses: responses,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		log.Printf("Response encoding error: %v", err)
	}
}
