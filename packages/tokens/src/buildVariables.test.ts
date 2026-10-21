// The component variable objects are generated during build, so the alias
// check reads the built package; everything else tests the source.
import { componentColors, componentVariables } from '@entur/tokens';
import {
  createColorSet,
  createColorsFileData,
  createJSColorFileData,
  createVariableSet,
  createVariablesFileData,
} from './buildVariables';

const primitiveFileData = JSON.stringify([
  {
    name: 'Primitives',
    values: [
      {
        mode: { name: 'Mode 1' },
        color: [
          {
            name: 'Blue Gray/10',
            value: '#f6f6f9',
            var: '',
            rootAlias: '',
          },
        ],
        number: [
          { name: 'size-0', value: '0rem', var: '', rootAlias: '' },
          { name: 'size-8', value: '1rem', var: '', rootAlias: '' },
        ],
      },
    ],
  },
]);

const themeFileData = JSON.stringify([
  {
    name: 'Theme',
    values: [
      {
        mode: { name: 'Light' },
        color: [
          {
            name: 'Base colors/Frame/Default',
            value: '#ffffff',
            var: 'White/Alpha-100',
            rootAlias: 'White/Alpha-100',
          },
        ],
        number: [],
      },
      {
        mode: { name: 'Dark' },
        color: [
          {
            name: 'Base colors/Frame/Default',
            value: '#181c56',
            var: 'Lavender/90',
            rootAlias: 'Lavender/90',
          },
        ],
        number: [],
      },
    ],
  },
]);

describe('published token helpers', () => {
  test('converts literal colors to stylesheet names and numeric JS keys', () => {
    expect(createVariableSet(primitiveFileData)).toEqual([
      {
        css: { key: '--bluegray-10', value: '#f6f6f9' },
        scss: {
          key: '$bluegray-10',
          value: '#f6f6f9',
          sanitizedValue: '#f6f6f9',
        },
        less: { key: '@bluegray-10', value: '#f6f6f9' },
        js: { key: 'blueGray._10', value: '#f6f6f9' },
        mode: 'mode 1',
        usesAlias: false,
      },
    ]);
  });

  test('keeps stylesheet aliases but resolves JS values in each color mode', () => {
    expect(createVariableSet(themeFileData)).toEqual([
      {
        css: {
          key: '--basecolors-frame-default',
          value: 'var(--white-alpha-100)',
        },
        scss: {
          key: '$basecolors-frame-default',
          value: '$white-alpha-100',
          sanitizedValue: '#{$white-alpha-100}',
        },
        less: {
          key: '@basecolors-frame-default',
          value: '@white-alpha-100',
        },
        js: { key: 'light.baseColors.frame.default', value: '#ffffff' },
        mode: 'light',
        usesAlias: true,
      },
      {
        css: {
          key: '--basecolors-frame-default',
          value: 'var(--lavender-90)',
        },
        scss: {
          key: '$basecolors-frame-default',
          value: '$lavender-90',
          sanitizedValue: '#{$lavender-90}',
        },
        less: {
          key: '@basecolors-frame-default',
          value: '@lavender-90',
        },
        js: { key: 'dark.baseColors.frame.default', value: '#181c56' },
        mode: 'dark',
        usesAlias: true,
      },
    ]);
  });

  test('combines numeric tokens with nested colors without coercing CSS units', () => {
    const numbers = createVariableSet(primitiveFileData, 'number');
    expect(numbers.map(variable => variable.css)).toEqual([
      { key: '--size-0', value: '0rem' },
      { key: '--size-8', value: '1rem' },
    ]);

    const file = createJSColorFileData({
      variables: [...createVariableSet(primitiveFileData), ...numbers],
      name: 'primitive',
    });

    expect(file.outputFileName).toBe('primitive.ts');
    expect(
      JSON.parse(file.outputString.split('export const primitive = ')[1]),
    ).toEqual({
      blueGray: { _10: '#f6f6f9' },
      size0: '0rem',
      size8: '1rem',
    });
  });

  test('generates default light and explicit dark CSS rules with alias imports', () => {
    const files = createVariablesFileData({
      variableSet: createVariableSet(themeFileData),
      keyType: 'css',
      valueType: 'css',
      name: 'theme',
      withColorMode: true,
      importFileNames: ['primitive'],
    });

    expect(files).toHaveLength(1);
    expect(files[0].outputFileName).toBe('theme.css');
    expect(files[0].outputString).toContain(
      "@import '@entur/tokens/dist/primitive.css';",
    );
    expect(files[0].outputString).toContain(
      "[data-color-mode='light'],\n:root {\n  --basecolors-frame-default: var(--white-alpha-100);\n}",
    );
    expect(files[0].outputString).toContain(
      "[data-color-mode='dark'] {\n  --basecolors-frame-default: var(--lavender-90);\n}",
    );
  });

  test('interpolates Sass aliases when generating CSS custom properties', () => {
    const [file] = createVariablesFileData({
      variableSet: createVariableSet(themeFileData),
      keyType: 'css',
      valueType: 'scss',
      name: 'theme',
      withColorMode: true,
      importFileNames: ['primitive'],
    });

    expect(file.outputFileName).toBe('theme.scss');
    expect(file.outputString).toContain(
      "@forward '@entur/tokens/dist/primitive.scss';\n@use '@entur/tokens/dist/primitive.scss' as *;",
    );
    expect(file.outputString).toContain(
      "[data-color-mode='light'],\n:root {\n  --basecolors-frame-default: #{$white-alpha-100};\n}",
    );
    expect(file.outputString).toContain(
      "[data-color-mode='dark'] {\n  --basecolors-frame-default: #{$lavender-90};\n}",
    );
  });

  test('generates separate nested JS objects with resolved light and dark colors', () => {
    const file = createJSColorFileData({
      variables: createVariableSet(themeFileData),
      name: 'theme',
    });

    expect(file.outputFileName).toBe('theme.ts');
    expect(
      JSON.parse(file.outputString.split('export const theme = ')[1]),
    ).toEqual({
      light: { baseColors: { frame: { default: '#ffffff' } } },
      dark: { baseColors: { frame: { default: '#181c56' } } },
    });
  });

  test('preserves legacy color helper results when migrating to variable helpers', () => {
    const colorSet = createColorSet(themeFileData);
    const variableSet = createVariableSet(themeFileData, 'color');
    const options = {
      keyType: 'css' as const,
      valueType: 'scss' as const,
      name: 'theme',
      withColorMode: true,
      importFileNames: ['primitive'],
    };

    expect(colorSet).toEqual(variableSet);
    expect(createColorsFileData({ ...options, colorSet })).toEqual(
      createVariablesFileData({ ...options, variableSet }),
    );
  });

  test('keeps the legacy component color export identical to component variables', () => {
    expect(componentColors).toBe(componentVariables);
  });
});
