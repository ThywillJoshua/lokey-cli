const fs = require("fs");
const path = require("path");

// Read and parse the JSON configuration file
function readConfig() {
  const configFilePath = "translate.config.json";
  if (!fs.existsSync(configFilePath)) {
    throw new Error("Configuration file does not exist.");
  }
  const configData = fs.readFileSync(configFilePath, "utf-8");
  return JSON.parse(configData);
}

// Write JSON data to a file with indentation
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Create files with empty JSON objects
function createFiles(config, filenames) {
  filenames.forEach((filename) => {
    const filePath = path.join(config.config["files-path"], filename);
    fs.writeFileSync(filePath, "{}", "utf-8");
    console.log(`Created file: ${filePath}`);
  });
}

// Sort object keys
function sortObjectKeys(obj) {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj = {};
  sortedKeys.forEach((key) => {
    sortedObj[key] = obj[key];
  });
  return sortedObj;
}

// Update target map with default content
function updateSortedMap(target, defaultContent, pathPrefix) {
  let addedKeys = [];
  let removedKeys = [];
  let additionCount = 0;
  let removalCount = 0;

  // Add or update target keys
  Object.keys(defaultContent).forEach((key) => {
    const fullPath = pathPrefix + key;
    if (!(key in target)) {
      addedKeys.push(fullPath);
      target[key] = defaultContent[key];
      additionCount++;
    } else if (
      typeof target[key] === "object" &&
      typeof defaultContent[key] === "object"
    ) {
      const nestedResults = updateSortedMap(
        target[key],
        defaultContent[key],
        fullPath + "."
      );
      removalCount += nestedResults.removalCount;
      addedKeys = addedKeys.concat(nestedResults.addedKeys);
      removedKeys = removedKeys.concat(nestedResults.removedKeys);
      additionCount += nestedResults.additionCount;
    }
  });

  // Remove keys from target that are not in default
  Object.keys(target).forEach((key) => {
    if (!(key in defaultContent)) {
      removedKeys.push(pathPrefix + key);
      delete target[key];
      removalCount++;
    }
  });

  return { additionCount, addedKeys, removalCount, removedKeys };
}

// Synchronize files with the default content
function syncFiles(config) {
  const defaultFilePath = path.join(
    config.config["files-path"],
    config.config["default-file"]
  );
  const defaultFileContent = JSON.parse(
    fs.readFileSync(defaultFilePath, "utf-8")
  );
  const sortedDefaultFileContent = sortObjectKeys(defaultFileContent);
  writeJSON(defaultFilePath, sortedDefaultFileContent);

  fs.readdirSync(config.config["files-path"]).forEach((file) => {
    const filePath = path.join(config.config["files-path"], file);
    if (
      path.extname(file) === ".json" &&
      file !== config.config["default-file"]
    ) {
      const targetFileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const results = updateSortedMap(
        targetFileContent,
        sortedDefaultFileContent,
        ""
      );
      if (results.removalCount > 0) {
        console.log(
          `Removed ${results.removalCount} keys from file: ${filePath}`
        );
        results.removedKeys.forEach((key) =>
          console.log(`Removed key: ${key}`)
        );
      }
      if (results.additionCount > 0) {
        console.log(`Added ${results.additionCount} keys to file: ${filePath}`);
        results.addedKeys.forEach((key) => console.log(`Added key: ${key}`));
      }
      if (results.removalCount === 0 && results.additionCount === 0) {
        console.log(`No changes made to file: ${filePath}`);
      }
      writeJSON(filePath, sortObjectKeys(targetFileContent));
      console.log(`Updated file: ${filePath}`);
    }
  });
}

// Create the initial configuration file
function createConfigFile() {
  const filename = "translate.config.json";
  const content = {
    "project-name": "<name of project>",
    config: {
      "files-path": "<path of translation files>",
      "default-file": "<path of default file>",
    },
  };

  if (fs.existsSync(filename)) {
    console.log(
      `The file ${filename} already exists. Please delete it first and run the command again.`
    );
    return;
  }

  writeJSON(filename, content);
  console.log(`${filename} has been created with the initial configuration.`);
}

// Display help message
function showHelp() {
  console.log("Usage: translate <command> [<args>]");
  console.log();
  console.log("Commands:");
  console.log(
    "  create <file1> <file2> ...      Create new JSON files in the directory specified in the configuration."
  );
  console.log(
    "                                 Example: translate create en.json fr.json"
  );
  console.log();
  console.log(
    "  sync                           Sync all JSON files in the directory with the default file specified in the configuration."
  );
  console.log(
    "                                 This will add missing keys and remove extra keys to match the default file."
  );
  console.log("                                 Example: translate sync");
  console.log();
  console.log(
    "  init                           Create the initial configuration file 'translate.config.json'."
  );
  console.log(
    "                                 This command should be run before any other commands if the config file does not exist."
  );
  console.log("                                 Example: translate init");
  console.log();
  console.log("Options:");
  console.log("  --help                         Show this help message.");
  console.log();
  console.log("Description:");
  console.log(
    "  The 'translate' tool helps in managing and synchronizing translation JSON files."
  );
  console.log(
    "  The path for the 'create' and 'sync' commands is obtained from the configuration file 'translate.config.json'."
  );
  console.log(
    "  The 'create' command generates new JSON files with empty objects."
  );
  console.log(
    "  The 'sync' command updates existing JSON files with the content of the default JSON file,"
  );
  console.log("  ensuring that all files have consistent keys.");
}

// Main function
function main() {
  if (process.argv.length < 3) {
    showHelp();
    return;
  }

  const command = process.argv[2];

  if (command === "--help") {
    showHelp();
    return;
  }

  let config;
  try {
    config = readConfig();
  } catch (error) {
    console.error(error.message);
    return;
  }

  switch (command) {
    case "init":
      createConfigFile();
      break;
    case "create":
      if (process.argv.length < 4) {
        console.log("Usage: create <file1> <file2> ...");
        return;
      }
      const filenames = process.argv.slice(3);
      createFiles(config, filenames);
      break;
    case "sync":
      syncFiles(config);
      break;
    default:
      console.log("Unknown command. Usage: <create|sync> [<args>]");
  }
}

main();
