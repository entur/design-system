import path from 'path';
import { createColorSet, createColorsFileData } from '../src/buildVariables';
import {
  baseFileData,
  componentFileData,
  dataFileData,
  getAllPackageNames,
  outputFileData,
  primitiveFileData,
  semanticFileData,
  transportFileData,
} from './utils';

const outputExtensions: Array<'css' | 'scss' | 'less'> = [
  'css',
  'scss',
  'less',
];

try {
  const colorFiles = [
    { colorData: createColorSet(primitiveFileData), name: 'primitive' },
    { colorData: createColorSet(transportFileData), name: 'transport' },
    { colorData: createColorSet(semanticFileData), name: 'semantic' },
    { colorData: createColorSet(dataFileData), name: 'data' },
    { colorData: createColorSet(baseFileData), name: 'base' },
  ];
  const componentColors = createColorSet(componentFileData);

  colorFiles.forEach(colorFile => {
    outputExtensions.forEach(extension => {
      const hasColorMode = ['base', 'data'].includes(colorFile.name);
      if (hasColorMode && extension === 'less') return;
      const data = createColorsFileData({
        colorSet: colorFile.colorData,
        keyType: hasColorMode ? 'css' : extension,
        valueType: extension,
        name: colorFile.name,
      });
      outputFileData({
        fileData: data[0].outputString,
        outputFileName: data[0].outputFileName,
        outputPath: path.resolve(__dirname, '../dist'),
      });
    });
  });
  console.info('🎉 Created stylesheets for', colorFiles.length, 'color sets!');

  const allPackages = getAllPackageNames();
  const componentColorData = createColorsFileData({
    colorSet: componentColors,
    keyType: 'css',
    valueType: 'scss',
    name: 'componentColors',
    outputToPackages: allPackages,
  });
  allPackages.forEach(packageName => {
    const colorData = componentColorData.find(
      data => data.packageName === packageName,
    );
    if (colorData?.packageName === undefined) return;

    outputFileData({
      fileData: colorData.outputString,
      outputFileName: colorData.outputFileName,
      outputPath: path.resolve(
        __dirname,
        '..',
        '..',
        colorData.packageName,
        'src/',
      ),
    });
  });
  console.info(
    '🎉 Created componentColors for',
    allPackages.length,
    'packages – Enjoy! 👨🏻‍🍳',
  );
} catch (error) {
  console.error(`Error creating color variables: ${error}`);
}
