import fs from 'fs-extra';
import path from 'path';

export function getAllPackageNames() {
  const packageNames = fs
    .readdirSync(path.resolve(__dirname, '../../../packages'), {
      withFileTypes: true,
    })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  return packageNames;
}

export function toKebabCase(name: string) {
  return name.replace(/\//g, '-').replace(/\s/g, '').toLowerCase();
}

export function toFlattenedJSObjectKey(name: string) {
  const nameWithoutSpacesAndDashes = name
    .toLowerCase()
    .replace(/\s(\w)/g, (_, letter) => letter.toUpperCase())
    .replace(/\-(\w)/g, (_, letter) => letter.toUpperCase());
  const nameArray = nameWithoutSpacesAndDashes.split('/');

  const nameArrayWithStringNumbers = nameArray.map(namePart => {
    if (!isNaN(Number(namePart.charAt(0)))) {
      return `_${namePart}`;
    }
    return namePart;
  });
  return nameArrayWithStringNumbers.join('.');
}
