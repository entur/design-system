import fs from 'fs-extra';
import path from 'path';
import { createColorSet, createColorsFileData } from '@entur/tokens';

const componentColorsFileData = fs.readFileSync(
  path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'packages/tokens/src/',
    'component.json',
  ),
  'utf-8',
);

try {
  const designEnturComponentColors = createColorSet(
    componentColorsFileData,
  ).filter(color => color.js.key.includes('designentur'));

  const componentColorsOutputData = createColorsFileData({
    colorSet: designEnturComponentColors,
    name: 'designEnturComponentColors',
    keyType: 'css',
    valueType: 'scss',
    withColorMode: true,
    importFileNames: ['semantic'],
  });

  fs.writeFileSync(
    path.join(__dirname, componentColorsOutputData[0].outputFileName),
    componentColorsOutputData[0].outputString,
  );
  console.log(designEnturComponentColors);
} catch (e) {
  console.log(e);
}
