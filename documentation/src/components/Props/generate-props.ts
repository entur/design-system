import { withCustomConfig } from 'react-docgen-typescript';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsConfigPath = path.join(__dirname, '../../../tsconfig.json');

// Initialize react-docgen-typescript with TypeScript config
const parser = withCustomConfig(tsConfigPath, {
  propFilter: (prop: any) => {
    if (prop.parent) {
      return !prop.parent.fileName.includes('node_modules');
    }
    return true;
  },
});

const componentsRootDir = path.join(__dirname, '../../../../packages');

const outputDir = path.join(__dirname, 'eds-component-props');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to recursively traverse directories and find .tsx files, skip index and test-files
function getAllComponentFiles(
  dirPath: string,
  arrayOfFiles: string[] = [],
): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file: string) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllComponentFiles(fullPath, arrayOfFiles);
    } else if (
      fullPath.endsWith('.tsx') &&
      !file.includes('.test') &&
      !file.includes('index.tsx')
    ) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Check if the JSON file needs to be updated
function needsUpdate(componentFile: string, jsonFile: string): boolean {
  if (!fs.existsSync(jsonFile)) {
    return true; // JSON file doesn't exist, needs to be created
  }

  const componentStats = fs.statSync(componentFile);
  const jsonStats = fs.statSync(jsonFile);

  return componentStats.mtime > jsonStats.mtime; // Return true if component was modified after the JSON file
}

// Parse and generate JSON for each .tsx file if needed
function generatePropFilesForComponents(): void {
  const componentFiles = getAllComponentFiles(componentsRootDir);
  let updatedFilesCount = 0;

  console.log(`👩🏼‍🍳 Starting making components-props..`);
  console.log(`🔎 Found ${componentFiles.length} components`);

  componentFiles.forEach(componentFile => {
    try {
      const componentName = path.basename(componentFile, '.tsx');
      const outputFilePath = path.join(outputDir, `${componentName}.json`);

      if (!needsUpdate(componentFile, outputFilePath)) {
        return; // Skip this component as it's already up-to-date
      }

      const propFiles = parser.parse(componentFile);

      // Remove the filePath property from the parsed data
      propFiles.forEach((file: any) => {
        delete file.filePath;
      });

      // Write the updated JSON file
      fs.writeFileSync(outputFilePath, JSON.stringify(propFiles, null, 2));
      console.log(`✅ Found changes and updated ${componentName}`);
      updatedFilesCount++;
    } catch (error) {
      console.error(`Failed to extract props for ${componentFile}:`, error);
    }
  });

  console.log(
    `Updated props for ${updatedFilesCount} out of ${componentFiles.length} components`,
  );
}

generatePropFilesForComponents();
