import fs from 'fs-extra';
import path from 'path';
import toCase from 'case';

// Traverses a directory
// returns an array of all file paths
function traverse(directory: string, dirEnt: fs.Dirent | null): string[] {
  const entryName = dirEnt ? dirEnt.name : '';
  const completePath = path.resolve(directory, entryName);
  if (dirEnt && dirEnt.isFile()) {
    return [completePath];
  }
  const directoryContent = fs.readdirSync(completePath, {
    withFileTypes: true,
  });
  return directoryContent
    .map(nextDirEnt => traverse(completePath, nextDirEnt))
    .reduce(
      (acc, next) => (Array.isArray(next) ? [...acc, ...next] : [...acc, next]),
      [],
    );
}

const indexFileString = traverse('src', null)
  .map(filePath => {
    const componentName = toCase.pascal(path.basename(filePath, '.tsx'));
    const importPath = path
      .relative('.', filePath)
      .replace('src/', './')
      .replace(/.tsx$/, '');
    return `export { default as ${componentName}Icon } from '${importPath}';`;
  })
  .join('\n');

fs.writeFileSync(path.resolve('src', 'index.ts'), indexFileString);
