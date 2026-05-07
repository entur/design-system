import { ComponentDoc, withCustomConfig } from 'react-docgen-typescript';
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

fs.mkdirSync(outputDir, { recursive: true });

const hashesPath = path.join(outputDir, '_hashes.json');

interface HashEntry {
  hash: string;
  outputs: string[];
}

function loadHashes(): Record<string, HashEntry> {
  try {
    const content = fs.readFileSync(hashesPath, { encoding: 'utf8' });
    const parsed = JSON.parse(content);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
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
    const componentFileHashKey = path.relative(
      componentsRootDir,
      componentFile,
    );
    const currentHash = hashFile(componentFile);
    const storedHash = hashes[componentFileHashKey];
    if (
      // Check if file is unchanged
      storedHash?.hash === currentHash &&
      // Check if all output props files exist
      storedHash.outputs.every(o => fs.existsSync(path.join(outputDir, o)))
    )
      return;

    const { parsed, outputs } = generatePropFileForComponent(componentFile);
    if (parsed) {
      hashes[componentFileHashKey] = { hash: currentHash, outputs };
      hashesChanged = true;
    }
  });

  if (hashesChanged) {
    fs.writeFileSync(hashesPath, JSON.stringify(hashes, null, 2) + '\n', {
      encoding: 'utf8',
    });
  }
}

function generatePropFileForComponent(componentFile: string): {
  parsed: boolean;
  outputs: string[];
} {
  const outputs: string[] = [];
  try {
    const parsedProps = parser.parse(componentFile);

    parsedProps.forEach((componentProps: Partial<ComponentDoc>) => {
      delete componentProps.filePath;

      const componentDisplayName = componentProps.displayName;
      const outputFilePath = path.join(
        outputDir,
        `${componentDisplayName}.json`,
      );
      const normalizedJson = JSON.stringify(componentProps, null, 2) + '\n';

      outputs.push(`${componentDisplayName}.json`);

      let existingContent: string | null = null;
      try {
        existingContent = fs.readFileSync(outputFilePath, { encoding: 'utf8' });
      } catch {
        // file doesn't exist yet
      }

      if (existingContent === normalizedJson) return;

      fs.writeFileSync(outputFilePath, normalizedJson, { encoding: 'utf8' });

      console.log(
        `🚧 ${componentDisplayName}: Found changes and updated prop file.\n⚠️ This change should be committed to the repo!`,
      );
    });
    return { parsed: true, outputs };
  } catch (error) {
    console.error(`Failed to extract props for ${componentFile}:`, error);
    return { parsed: false, outputs: [] };
  }
}

generatePropFiles();
