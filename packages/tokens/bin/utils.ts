import fs from 'fs-extra';
import path from 'path';

export const primitiveFileData = fs.readFileSync(
  path.resolve(__dirname, '../src/primitive.json'),
  'utf-8',
);
export const semanticFileData = fs.readFileSync(
  path.resolve(__dirname, '../src/semantic.json'),
  'utf-8',
);
export const baseFileData = fs.readFileSync(
  path.resolve(__dirname, '../src/base.json'),
  'utf-8',
);
export const dataFileData = fs.readFileSync(
  path.resolve(__dirname, '../src/data.json'),
  'utf-8',
);
export const transportFileData = fs.readFileSync(
  path.resolve(__dirname, '../src/transport.json'),
  'utf-8',
);
export const componentFileData = fs.readFileSync(
  path.resolve(__dirname, '../src/component.json'),
  'utf-8',
);

export function getAllPackageNames() {
  const packageNames = fs
    .readdirSync(path.resolve(__dirname, '../../../packages'), {
      withFileTypes: true,
    })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  return packageNames;
}

export function outputFileData({
  fileData,
  outputPath,
  outputFileName,
}: {
  fileData: string;
  outputPath: string;
  outputFileName: string;
}) {
  fs.outputFileSync(path.join(outputPath, outputFileName), fileData);
}
