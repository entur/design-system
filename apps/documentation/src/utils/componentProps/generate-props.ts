import { withCustomConfig } from 'react-docgen-typescript';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsConfigPath = path.join(__dirname, '../../../tsconfig.json');

// Initialize react-docgen-typescript with TypeScript config
const parser = withCustomConfig(tsConfigPath, {
  propFilter: (prop: any) => {
    if (
      prop?.parent?.fileName?.includes('node_modules') ||
      prop.description?.includes('@internal')
    ) {
      return false;
    }
    return true;
  },
});

const componentsRootDir = path.join(__dirname, '../../../../../packages');

const outputDir = path.join(__dirname, 'eds-component-props');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const hashesPath = path.join(outputDir, '_hashes.json');

function loadHashes(): Record<string, string> {
  if (fs.existsSync(hashesPath)) {
    return JSON.parse(fs.readFileSync(hashesPath, { encoding: 'utf8' }));
  }
  return {};
}

function hashFile(filePath: string): string {
  return crypto
    .createHash('md5')
    .update(fs.readFileSync(filePath))
    .digest('hex');
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

// Parse and generate JSON for each .tsx file if needed
function generatePropFiles(): void {
  const componentFiles = getAllComponentFiles(componentsRootDir);
  const hashes = loadHashes();
  let hashesChanged = false;

  console.log('🕵🏻‍♂️ Checking if prop files are out of date …');

  componentFiles.forEach(componentFile => {
    const relativeKey = path.relative(componentsRootDir, componentFile);
    const currentHash = hashFile(componentFile);
    if (hashes[relativeKey] === currentHash) return;

    const changed = generatePropFileForComponent(componentFile);
    if (changed) {
      hashes[relativeKey] = currentHash;
      hashesChanged = true;
    }
  });

  if (hashesChanged) {
    fs.writeFileSync(hashesPath, JSON.stringify(hashes, null, 2) + '\n', {
      encoding: 'utf8',
    });
  }
}

// Returns true if any prop file was written
function generatePropFileForComponent(componentFile: string): boolean {
  let anyChanged = false;
  try {
    const propFiles = parser.parse(componentFile);

    propFiles.forEach((component: any) => {
      delete component.filePath;

      const componentDisplayName = component.displayName;
      const outputFilePath = path.join(
        outputDir,
        `${componentDisplayName}.json`,
      );
      const normalizedJson = JSON.stringify(component, null, 2) + '\n';

      const existingContent = fs.existsSync(outputFilePath)
        ? fs.readFileSync(outputFilePath, { encoding: 'utf8' })
        : null;

      if (existingContent === normalizedJson) return;

      fs.writeFileSync(outputFilePath, normalizedJson, { encoding: 'utf8' });
      anyChanged = true;

      console.log(
        `🚧 ${componentDisplayName}: Found changes and updated prop file.\n⚠️ This change should be committed to the repo!`,
      );
    });
  } catch (error) {
    console.error(`Failed to extract props for ${componentFile}:`, error);
  }
  return anyChanged;
}

generatePropFiles();
