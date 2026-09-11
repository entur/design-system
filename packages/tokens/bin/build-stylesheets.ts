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

  // Data tokens are mode-dependent and only ever become CSS variables, so a
  // component token aliasing one has no SCSS variable to point at. It keeps the
  // reference and carries the resolved colour as a fallback, so it still works
  // for consumers that do not load the data stylesheet.
  const dataTokensByModeAndKey = new Map<string, VariableSet>(
    dataTokens.map(token => [`${token.mode}|${token.scss.key}`, token]),
  );
  const scssVariableKeys = new Set(
    colorFiles
      .filter(colorFile => colorFile.name !== 'data')
      .flatMap(colorFile => colorFile.colorData.map(token => token.scss.key)),
  );
  const MAX_ALIAS_DEPTH = 5;

  const resolveDataAliases = (variables: VariableSet[]) =>
    variables.map(variable => {
      if (!variable.usesAlias) return variable;

      const target = dataTokensByModeAndKey.get(
        `${variable.mode}|${variable.scss.value}`,
      );
      if (!target) {
        if (!scssVariableKeys.has(variable.scss.value)) {
          throw new Error(
            `${variable.css.key} (${variable.mode}) aliases ${variable.scss.value}, which is neither a data token nor an SCSS variable`,
          );
        }
        return variable;
      }

      // The reference stays on the token this one aliases; the chain is only
      // followed to find a colour for the fallback.
      let fallback = target;
      for (
        let depth = 0;
        depth < MAX_ALIAS_DEPTH && fallback.usesAlias;
        depth++
      ) {
        const next = dataTokensByModeAndKey.get(
          `${fallback.mode}|${fallback.scss.value}`,
        );
        if (!next) break;
        fallback = next;
      }
      if (fallback.usesAlias) {
        throw new Error(
          `${variable.css.key} (${variable.mode}) aliases ${variable.scss.value}, which does not resolve to a colour within ${MAX_ALIAS_DEPTH} steps`,
        );
      }

      const reference = `var(${target.css.key}, ${fallback.css.value})`;
      return {
        ...variable,
        css: { ...variable.css, value: reference },
        scss: { ...variable.scss, value: reference, sanitizedValue: reference },
        less: { ...variable.less, value: reference },
        usesAlias: false,
      };
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
  // Exit non-zero, or a release ships whatever the last successful run wrote.
  console.error(`Error creating color variables: ${error}`);
  process.exitCode = 1;
}
