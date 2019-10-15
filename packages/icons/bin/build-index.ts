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

let indexFileString = traverse('src/svgs', null)
  .map(filePath => {
    const componentName = toCase.pascal(path.basename(filePath, '.svg'));
    const importPath = path.relative('.', filePath).replace('src/', './');
    return `export { default as ${componentName}Icon } from '${importPath}';`;
  })
  .join('\n');

indexFileString = `import './styles.scss';\n\n${indexFileString}`;

fs.outputFileSync(path.resolve('src', 'index.ts'), indexFileString);
