package config

import (
	"encoding/json"
	"fmt"
	"os"
)

// Configuration holds the structure of the JSON configuration
type Configuration struct {
	ProjectName string `json:"project-name"`
	Config      Config `json:"config"`
}

// Config holds the nested configuration details
type Config struct {
	FilesPath   string `json:"files-path"`
	DefaultFile string `json:"default-file"`
}

// LoadConfig loads the configuration from a file
func LoadConfig(filePath string) (Configuration, error) {
	var cfg Configuration
	data, err := os.ReadFile(filePath)
	if err != nil {
		return cfg, err
	}

	err = json.Unmarshal(data, &cfg)
	return cfg, err
}

// CreateConfigFile creates an initial configuration file
func CreateConfigFile() {
	filename := "translate.config.json"
	content := map[string]interface{}{
		"project-name": "<name of project>",
		"config": map[string]string{
			"files-path":   "<path of translation files>",
			"default-file": "<path of default file>",
		},
	}

	if _, err := os.Stat(filename); err == nil {
		fmt.Printf("The file %s already exists. Delete it first to create a new one.\n", filename)
		return
	}

	fileContent, err := json.MarshalIndent(content, "", "  ")
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		return
	}

	err = os.WriteFile(filename, fileContent, 0644)
	if err != nil {
		fmt.Println("Error writing file:", err)
		return
	}

	fmt.Printf("%s has been created with the initial configuration.\n", filename)
}
