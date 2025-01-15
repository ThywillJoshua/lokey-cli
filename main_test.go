package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestSyncFiles(t *testing.T) {
	// Set up a temporary directory for testing
	dir := t.TempDir()
	config := Configuration{
		ProjectName: "TestProject",
		Config: Config{
			FilesPath:   dir,
			DefaultFile: "default.json",
		},
	}

	// Create the default file
	defaultFilePath := filepath.Join(dir, "default.json")
	defaultContent := SortedMap{
		Keys:   []string{"key1", "key2"},
		Values: map[string]interface{}{"key1": "value1", "key2": "value2"},
	}
	defaultFileData, err := json.MarshalIndent(defaultContent, "", "  ")
	if err != nil {
		t.Fatalf("Error marshalling default content: %v", err)
	}
	err = os.WriteFile(defaultFilePath, defaultFileData, 0644)
	if err != nil {
		t.Fatalf("Error writing default file: %v", err)
	}

	// Create the target file
	targetFilePath := filepath.Join(dir, "target.json")
	targetContent := SortedMap{
		Keys:   []string{"key1"},
		Values: map[string]interface{}{"key1": "oldvalue"},
	}
	targetFileData, err := json.MarshalIndent(targetContent, "", "  ")
	if err != nil {
		t.Fatalf("Error marshalling target content: %v", err)
	}
	err = os.WriteFile(targetFilePath, targetFileData, 0644)
	if err != nil {
		t.Fatalf("Error writing target file: %v", err)
	}

	// Perform the sync operation
	syncFiles(config)

	// Verify the target file content after sync
	expectedContent := SortedMap{
		Keys:   []string{"key1", "key2"},
		Values: map[string]interface{}{"key1": "value1", "key2": "value2"},
	}
	expectedData, err := json.MarshalIndent(expectedContent, "", "  ")
	if err != nil {
		t.Fatalf("Error marshalling expected content: %v", err)
	}
	updatedFileData, err := os.ReadFile(targetFilePath)
	if err != nil {
		t.Fatalf("Error reading updated target file: %v", err)
	}

	if string(updatedFileData) != string(expectedData) {
		t.Errorf("Expected %s, got %s", string(expectedData), string(updatedFileData))
	}
}
