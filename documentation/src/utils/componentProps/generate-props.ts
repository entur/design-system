import { withCustomConfig } from 'react-docgen-typescript';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

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

// Parse and generate JSON for each .tsx file if needed
function generatePropFiles(): void {
  const componentFiles = getAllComponentFiles(componentsRootDir);

  console.log(`🕵🏻‍♂️ Checking if prop files are out of date …`);

  componentFiles.forEach(componentFile => {
    const componentName = path.basename(componentFile, '.tsx');
    const outputFilePath = path.join(outputDir, `${componentName}.json`);

    updatePropsIfComponentIsModified(componentFile, outputFilePath);
  });
}

// Check if the JSON props file needs to be updated
async function updatePropsIfComponentIsModified(
  componentFile: string,
  jsonFile: string,
) {
  function getLastCommitDateForFile(file: string) {
    return `git log --follow -1 --pretty=format:"%h" --no-patch -- ${file} | xargs git show --no-patch --format=%ci`;
  }

  await exec(
    `${getLastCommitDateForFile(componentFile)}`,
    async function (errorComp, componentLastCommitDate, stderrComp) {
      await exec(
        `${getLastCommitDateForFile(jsonFile)}`,
        function (errorProps, propsLastCommitDate, stderrProps) {
          if (errorComp || stderrComp || errorProps || stderrProps) return;
          if (componentLastCommitDate > propsLastCommitDate) {
            generatePropFileForComponent(componentFile, jsonFile);
          }
        },
      );
    },
  );
}

function generatePropFileForComponent(
  componentFile: string,
  outputFilePath: string,
): void {
  try {
    const componentName = path.basename(componentFile, '.tsx');
    const propFiles = parser.parse(componentFile);

    // Remove the filePath property from the parsed data
    propFiles.forEach((file: any) => {
      delete file.filePath;
    });

    // Write the updated JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(propFiles, null, 2));
    console.log(
      `🚧 ${componentName}: Found changes and updated prop file.\n⚠️ This change should be commited to the repo!`,
    );
  } catch (error) {
    console.error(`Failed to extract props for ${componentFile}:`, error);
  }
}

generatePropFiles();
