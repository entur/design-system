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
  semanticFileData,
  transportFileData,
} from './utils';
import { createColorSet, createJSColorFileData } from '../src/buildVariables';

try {
  const primitive = createColorSet(primitiveFileData);
  const transport = createColorSet(transportFileData);
  const semantic = createColorSet(semanticFileData);
  const base = createColorSet(baseFileData);
  const data = createColorSet(dataFileData);
  const componentColors = createColorSet(componentFileData);
  const colorFiles = [
    { colorData: primitive, name: 'primitive' },
    { colorData: semantic, name: 'semantic' },
    { colorData: base, name: 'base' },
    { colorData: data, name: 'data' },
    { colorData: transport, name: 'transport' },
    { colorData: componentColors, name: 'componentColors' },
  ];

  colorFiles.forEach(colorFile => {
    const fileData = createJSColorFileData({
      variables: colorFile.colorData,
      name: colorFile.name,
    });
    outputFileData({
      fileData: fileData.outputString,
      outputFileName: fileData.outputFileName,
      outputPath: path.resolve(__dirname, '../src/'),
    });
  });
  console.info('🎉 Created JS-tokens for', colorFiles.length, 'color sets!');
} catch (error) {
  console.error(`Error creating color variables: ${error}`);
}
