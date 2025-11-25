/* We need our js file to be compiled and bundled by dts-cli.
   Therefore, we first create the files for the variables in
   the src folder, and then we run dts build to create the
   js files in the dist folder. */
import path from 'path';

import {
  baseFileData,
  componentFileData,
  dataFileData,
  outputFileData,
  primitiveFileData,
  primitiveSizesFileData,
  semanticFileData,
  transportFileData,
} from './utils';
import {
  createJSColorFileData,
  createVariableSet,
} from '../src/buildVariables';

try {
  // Merge primitive colors and sizes
  const primitiveColors = createVariableSet(primitiveFileData, 'color');
  const primitiveSizes = createVariableSet(primitiveSizesFileData, 'number');
  const combinedPrimitiveTokens = [...primitiveColors, ...primitiveSizes];

  const transport = createVariableSet(transportFileData, 'color');
  const semantic = createVariableSet(semanticFileData, 'color');
  const base = createVariableSet(baseFileData, 'color');
  const data = createVariableSet(dataFileData, 'color');

  // Extract specific categories from component.json
  const componentData = JSON.parse(componentFileData);
  const componentColorsCategory = componentData.find(
    (category: any) => category.name === 'Component colors',
  );
  const componentSizesCategory = componentData.find(
    (category: any) => category.name === 'Component size',
  );

  const componentColors = componentColorsCategory
    ? createVariableSet(JSON.stringify([componentColorsCategory]), 'color')
    : [];
  const componentSizes = componentSizesCategory
    ? createVariableSet(JSON.stringify([componentSizesCategory]), 'number')
    : [];
  const combinedComponentVariables = [...componentColors, ...componentSizes];

  const colorFiles = [
    { colorData: combinedPrimitiveTokens, name: 'primitive' },
    { colorData: semantic, name: 'semantic' },
    { colorData: base, name: 'base' },
    { colorData: data, name: 'data' },
    { colorData: transport, name: 'transport' },
    { colorData: combinedComponentVariables, name: 'componentVariables' },
  ];

  colorFiles.forEach(colorFile => {
    const fileData = createJSColorFileData({
      variables: colorFile.colorData,
      name: colorFile.name,
    });
    outputFileData({
      fileData: fileData.outputString,
      outputFileName: fileData.outputFileName,
      outputPath: path.resolve(__dirname, '../src/generated-js-objects'),
    });
  });
  console.info('🎉 Created JS-tokens for', colorFiles.length, 'color sets!');
} catch (error) {
  console.error(`Error creating color variables: ${error}`);
}
