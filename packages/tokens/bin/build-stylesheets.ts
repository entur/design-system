import path from 'path';
import {
  VariableSet,
  createColorsFileData,
  createVariableSet,
  createVariablesFileData,
} from '../src/buildVariables';
import {
  baseFileData,
  componentFileData,
  dataFileData,
  getAllPackageNames,
  outputFileData,
  primitiveFileData,
  primitiveSizesFileData,
  semanticFileData,
  transportFileData,
} from './utils';

const outputExtensions: Array<'css' | 'scss' | 'less'> = [
  'css',
  'scss',
  'less',
];

try {
  // Merge primitive colors and sizes
  const primitiveColors = createVariableSet(primitiveFileData, 'color');
  const primitiveSizes = createVariableSet(primitiveSizesFileData, 'number');
  const combinedPrimitiveTokens = [...primitiveColors, ...primitiveSizes];

  const dataTokens = createVariableSet(dataFileData, 'color');

  const colorFiles = [
    { colorData: combinedPrimitiveTokens, name: 'primitive' },
    {
      colorData: createVariableSet(transportFileData, 'color'),
      name: 'transport',
    },
    {
      colorData: createVariableSet(semanticFileData, 'color'),
      name: 'semantic',
    },
    { colorData: dataTokens, name: 'data' },
    { colorData: createVariableSet(baseFileData, 'color'), name: 'base' },
  ];
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

  // Data tokens only exist as mode-dependent CSS variables, never as SCSS
  // variables, so component tokens aliasing them get the value for their mode.
  const dataTokensByModeAndKey = new Map<string, VariableSet>(
    dataTokens.map(token => [`${token.mode}|${token.scss.key}`, token]),
  );
  const resolveDataAliases = (variables: VariableSet[]) =>
    variables.map(variable => {
      let resolved = variable;
      for (let depth = 0; depth < 5 && resolved.usesAlias; depth++) {
        const target = dataTokensByModeAndKey.get(
          `${resolved.mode}|${resolved.scss.value}`,
        );
        if (!target) break;
        resolved = {
          ...resolved,
          css: { ...resolved.css, value: target.css.value },
          scss: {
            ...resolved.scss,
            value: target.scss.value,
            sanitizedValue: target.scss.sanitizedValue,
          },
          less: { ...resolved.less, value: target.less.value },
          usesAlias: target.usesAlias,
        };
      }
      return resolved;
    });

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

  // Combine colors and sizes into a single componentVariables.scss file
  const combinedVariables = [
    ...resolveDataAliases(componentColors),
    ...componentSizes,
  ];
  const componentVariablesData = createVariablesFileData({
    variableSet: combinedVariables,
    keyType: 'css',
    valueType: 'scss',
    name: 'componentVariables',
    outputToPackages: allPackages,
  });

  allPackages.forEach(packageName => {
    const variableData = componentVariablesData.find(
      data => data.packageName === packageName,
    );
    if (variableData?.packageName === undefined) return;

    outputFileData({
      fileData: variableData.outputString,
      outputFileName: variableData.outputFileName,
      outputPath: path.resolve(
        __dirname,
        '..',
        '..',
        variableData.packageName,
        'src/',
      ),
    });
  });
  console.info(
    '🎉 Created componentVariables for',
    allPackages.length,
    'packages – Enjoy! 👨🏻‍🍳',
  );
} catch (error) {
  console.error(`Error creating color variables: ${error}`);
}
