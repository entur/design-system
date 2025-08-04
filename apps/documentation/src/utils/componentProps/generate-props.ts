import { withCustomConfig } from 'react-docgen-typescript';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import util from 'util';

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

const componentsRootDir = path.join(__dirname, '../../../../../packages');

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

// Parse and generate JSON for each .tsx file if needed
function generatePropFiles(): void {
  const componentFiles = getAllComponentFiles(componentsRootDir);

  console.log('🕵🏻‍♂️ Checking if prop files are out of date …');

  componentFiles.forEach(componentFile => {
    const componentName = path.basename(componentFile, '.tsx');
    const outputFilePath = path.join(outputDir, `${componentName}.json`);

    updatePropsIfComponentIsModified(componentFile, outputFilePath);
  });
}

const execFileAsync = util.promisify(execFile);

async function getLastCommitDateForFile(file: string): Promise<string> {
  try {
    // Get the commit hash for the file
    const { stdout: commitHash } = await execFileAsync('git', [
      'log',
      '--follow',
      '-1',
      '--pretty=format:%h',
      '--no-patch',
      '--',
      file,
    ]);

    // Get the commit date using the hash
    const { stdout: commitDate } = await execFileAsync('git', [
      'show',
      '--no-patch',
      '--format=%ci',
      commitHash.trim(),
    ]);

    return commitDate.trim();
  } catch {
    return '';
  }
}

// Check if the JSON props file needs to be updated
async function updatePropsIfComponentIsModified(
  componentFile: string,
  jsonFile: string,
) {
  try {
    const componentLastCommitDate = await getLastCommitDateForFile(
      componentFile,
    );
    const propsLastCommitDate = await getLastCommitDateForFile(jsonFile);

    if (componentLastCommitDate > propsLastCommitDate)
      generatePropFileForComponent(componentFile);
  } catch (error) {
    console.error(
      `Error checking if prop for ${jsonFile} needs update:`,
      error,
    );
  }
}

function generatePropFileForComponent(componentFile: string): void {
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

      fs.writeFileSync(outputFilePath, normalizedJson, { encoding: 'utf8' });

      console.log(
        `🚧 ${componentDisplayName}: Found changes and updated prop file.\n⚠️ This change should be committed to the repo!`,
      );
    });
  } catch (error) {
    console.error(`Failed to extract props for ${componentFile}:`, error);
  }
}

generatePropFiles();
