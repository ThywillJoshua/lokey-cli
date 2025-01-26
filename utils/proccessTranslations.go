package utils

import (
	"context"
	"fmt"
	"log"
	"lokey-cli/globals"
	"strings"
	"sync"

	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
	"github.com/tmc/langchaingo/llms/openai"
)


func ProcessTranslation(ctx context.Context, from string, to string, keyValues map[string]string) (map[string]string, map[string]string) {
    // Determine which LLM to use
    var llm llms.Model
    var err error
    switch globals.ConfigData.Config.LLM {
    case "openai":
        llm, err = openai.New()
    case "ollama":
        llm, err = ollama.New(ollama.WithModel("mistral"))
    default:
        return nil, map[string]string{"config": "Unsupported LLM configuration"}
    }

    if err != nil {
        return nil, map[string]string{"initialization": fmt.Sprintf("LLM initialization error: %v", err)}
    }
    
    translated := make(map[string]string)
    errors := make(map[string]string)

    var mutex sync.Mutex
    var wg sync.WaitGroup

    for key, value := range keyValues {
        wg.Add(1)

        go func(key, value string) {
            defer wg.Done()

            prompt := fmt.Sprintf(
                "Translate the following text from %s to %s." + globals.ConfigData.Config.LLM_Context + 
                ".Only return the translated text without quotes around it:\n\"%s\"",
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