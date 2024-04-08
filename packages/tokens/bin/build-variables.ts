import path from 'path';

import { createColorSet, outputColorsFiles } from '../src/utils';

export const primitiveFilePath = path.resolve(
  __dirname,
  '../src/primitive.json',
);
export const semanticFilePath = path.resolve(__dirname, '../src/semantic.json');
export const baseFilePath = path.resolve(__dirname, '../src/base.json');
export const dataFilePath = path.resolve(__dirname, '../src/data.json');
export const transportFilePath = path.resolve(
  __dirname,
  '../src/transport.json',
);
export const componentFilePath = path.resolve(
  __dirname,
  '../src/component.json',
);

const outputExtensions: Array<'css' | 'scss' | 'less'> = [
  'css',
  'scss',
  'less',
];

try {
  const primitive = createColorSet(primitiveFilePath);
  const transport = createColorSet(transportFilePath);
  const semantic = createColorSet(semanticFilePath);
  const data = createColorSet(dataFilePath);
  const base = createColorSet(baseFilePath);
  const componentColors = createColorSet(componentFilePath);

  outputExtensions.forEach(extension => {
    outputColorsFiles({
      colorSet: primitive,
      keyType: extension,
      valueType: extension,
      name: 'primitive',
    });
    outputColorsFiles({
      colorSet: semantic,
      keyType: extension,
      valueType: extension,
      name: 'semantic',
    });
    outputColorsFiles({
      colorSet: transport,
      keyType: extension,
      valueType: extension,
      name: 'transport',
    });
    // To support dynamic color mode, keyType
    // needs to be 'css', i.e. a css-variable
    if (extension !== 'less') {
      outputColorsFiles({
        colorSet: base,
        keyType: 'css',
        valueType: extension,
        name: 'base',
      });
      outputColorsFiles({
        colorSet: data,
        keyType: 'css',
        valueType: extension,
        name: 'data',
      });
    }
  });

  outputColorsFiles({
    colorSet: componentColors,
    keyType: 'css',
    valueType: 'scss',
    name: 'componentColors',
    toAllPackages: true,
  });
} catch (error) {
  console.error(`Error creating color variables: ${error}`);
}
