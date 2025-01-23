package main

import (
	"fmt"
	"os"

	"translate-cli/config"
	"translate-cli/fileutils"
	"translate-cli/globals"
	"translate-cli/server"
)

var ConfigData config.Configuration

func main() {
	if len(os.Args) < 2 {
		showHelp()
		return
	}

	command := os.Args[1]

	if command == "--help" {
		showHelp()
		return
	}

	// Read the configuration file
    var err error
	globals.ConfigData, err = config.LoadConfig("translate.config.json")
    if err != nil {
        fmt.Println("Error reading configuration file:", err)
        return
    }

	switch command {
	case "init":
		config.CreateConfigFile()
		return

	case "create":
		if len(os.Args) < 3 {
			fmt.Println("Usage: create <file1> <file2> ...")
			return
		}
		args := os.Args[2:]
		err = fileutils.CreateFiles(args...)
		if err != nil {
			fmt.Printf("Error: %v\n", err)
		}
		return

	case "sync":
		fileutils.SyncFiles()
		return
    
	case "ui":
		go server.StartHTTPServer()
	    // webview.CreateWebview()
		return

	default:
		showHelp()
		return
	}
}

func showHelp() {
	fmt.Println("Usage: translate <command> [<args>]")
	fmt.Println()
	fmt.Println("Commands:")
	fmt.Println("  create <file1> <file2> ...      Create new JSON files in the directory specified in the configuration.")
	fmt.Println("                                 Example: translate create en.json fr.json")
	fmt.Println()
	fmt.Println("  sync                           Sync all JSON files in the directory with the default file specified in the configuration.")
	fmt.Println("                                 This will add missing keys and remove extra keys to match the default file.")
	fmt.Println("                                 Example: translate sync")
	fmt.Println()
	fmt.Println("  init                           Create the initial configuration file 'translate.config.json'.")
	fmt.Println("                                 This command should be run before any other commands if the config file does not exist.")
	fmt.Println("                                 Example: translate init")
	fmt.Println()
	fmt.Println("Options:")
	fmt.Println("  --help                         Show this help message.")
	fmt.Println()
	fmt.Println("Description:")
	fmt.Println("  The 'translate' tool helps in managing and synchronizing translation JSON files.")
	fmt.Println("  The path for the 'create' and 'sync' commands is obtained from the configuration file 'translate.config.json'.")
	fmt.Println("  The 'create' command generates new JSON files with empty objects.")
	fmt.Println("  The 'sync' command updates existing JSON files with the content of the default JSON file,")
	fmt.Println("  ensuring that all files have consistent keys.")
}
