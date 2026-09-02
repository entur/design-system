import { buildColorTokenSummary, buildTypographySummary } from './rollups';
import type {
  ColorTokenFinding,
  ComponentUsage,
  CssOverrideFinding,
  HardcodedColorFinding,
  PackageUsage,
} from './types';

function pkg(overrides: Partial<PackageUsage> = {}): PackageUsage {
  return {
    name: '@entur/typography',
    version: '^3.0.4',
    isDev: false,
    isImported: true,
    filesImportingCount: 1,
    symbolCountUsed: 1,
    ...overrides,
  };
}

function component(overrides: Partial<ComponentUsage> = {}): ComponentUsage {
  return {
    packageName: '@entur/typography',
    componentName: 'Heading',
    instanceCount: 1,
    props: {},
    propsSpreadCount: 0,
    files: ['App.tsx'],
    importStyle: 'named',
    isAliased: false,
    ...overrides,
  };
}

function override(
  overrides: Partial<CssOverrideFinding> = {},
): CssOverrideFinding {
  return {
    selector: '.eds-heading',
    filePath: 'src/app.scss',
    lineNumber: 1,
    fileExtension: '.scss',
    packageName: '@entur/typography',
    baseClass: 'eds-heading',
    classGeneration: 'beta',
    source: 'stylesheet',
    ...overrides,
  };
}

describe('buildTypographySummary', () => {
  it('reports no adoption for a repo without the package', () => {
    const summary = buildTypographySummary({
      designSystemPackages: [],
      componentUsage: [],
      cssOverrides: [],
    });

    expect(summary.hasPackage).toBe(false);
    expect(summary.usesNewTypography).toBe(false);
    expect(summary.usesLegacyTypography).toBe(false);
    expect(summary.newShare).toBeNull();
  });

  it('counts beta instances as the new typography', () => {
    const summary = buildTypographySummary({
      designSystemPackages: [pkg()],
      componentUsage: [
        component({ instanceCount: 3, deepImportPath: '/beta' }),
        component({
          componentName: 'Text',
          instanceCount: 1,
          deepImportPath: '/beta',
        }),
      ],
      cssOverrides: [],
    });

    expect(summary.usesNewTypography).toBe(true);
    expect(summary.usesLegacyTypography).toBe(false);
    expect(summary.newInstanceCount).toBe(4);
    expect(summary.newShare).toBe(1);
  });

  it('reports the share of instances for a partially migrated repo', () => {
    // A repo that uses both generations shows as adopting; the share is what
    // makes the remaining migration visible
    const summary = buildTypographySummary({
      designSystemPackages: [pkg()],
      componentUsage: [
        component({ instanceCount: 3, deepImportPath: '/beta' }),
        component({ componentName: 'Heading1', instanceCount: 9 }),
      ],
      cssOverrides: [],
    });

    expect(summary.usesNewTypography).toBe(true);
    expect(summary.usesLegacyTypography).toBe(true);
    expect(summary.newInstanceCount).toBe(3);
    expect(summary.legacyInstanceCount).toBe(9);
    expect(summary.newShare).toBe(0.25);
  });

  it('separates the package being a devDependency from being used', () => {
    const summary = buildTypographySummary({
      designSystemPackages: [pkg({ isDev: true })],
      componentUsage: [component({ deepImportPath: '/beta' })],
      cssOverrides: [],
    });

    expect(summary.usesNewTypography).toBe(true);
    expect(summary.isDevDependency).toBe(true);
  });

  it('counts class overrides per generation and ignores other packages', () => {
    const summary = buildTypographySummary({
      designSystemPackages: [pkg()],
      componentUsage: [],
      cssOverrides: [
        override({ classGeneration: 'beta' }),
        override({ classGeneration: 'legacy', selector: '.eds-h1' }),
        override({ classGeneration: 'legacy', selector: '.eds-paragraph' }),
        override({
          packageName: '@entur/button',
          selector: '.eds-primary-button',
          classGeneration: 'legacy',
        }),
      ],
    });

    expect(summary.classOverrideCount).toBe(3);
    expect(summary.classOverrideBetaCount).toBe(1);
    expect(summary.classOverrideLegacyCount).toBe(2);
  });

  it('ignores components from other packages', () => {
    const summary = buildTypographySummary({
      designSystemPackages: [pkg()],
      componentUsage: [
        component({
          packageName: '@entur/button',
          componentName: 'PrimaryButton',
        }),
      ],
      cssOverrides: [],
    });

    expect(summary.newInstanceCount).toBe(0);
    expect(summary.legacyInstanceCount).toBe(0);
  });
});

describe('buildColorTokenSummary', () => {
  const tokens: ColorTokenFinding[] = [
    {
      tokenName: 'fill-background-tint-light',
      tokenLayer: 'semantic',
      tokenGeneration: 'new',
      occurrenceCount: 7,
      fileCount: 2,
      sources: ['stylesheet'],
    },
    {
      tokenName: 'colors-blues-blue50',
      tokenLayer: 'legacy',
      tokenGeneration: 'legacy',
      occurrenceCount: 3,
      fileCount: 1,
      sources: ['js-token-object'],
    },
  ];

  const hardcoded: HardcodedColorFinding[] = [
    {
      value: '#181c56',
      colorFormat: 'hex',
      occurrenceCount: 4,
      fileCount: 2,
      matchesTokenName: 'basecolors-frame-contrast',
      matchesTokenLayer: 'base',
      sources: ['stylesheet'],
    },
    {
      value: '#abcdef',
      colorFormat: 'hex',
      occurrenceCount: 2,
      fileCount: 1,
      sources: ['stylesheet'],
    },
  ];

  it('splits occurrences by token generation', () => {
    const summary = buildColorTokenSummary({
      analysisComplete: true,
      styleFilesScanned: 5,
      colorTokenUsage: tokens,
      hardcodedColors: hardcoded,
    });

    expect(summary.usageCount).toBe(10);
    expect(summary.newTokenCount).toBe(7);
    expect(summary.legacyTokenCount).toBe(3);
    expect(summary.distinctTokenCount).toBe(2);
  });

  it('counts hardcoded colours that already exist as a token', () => {
    const summary = buildColorTokenSummary({
      analysisComplete: true,
      styleFilesScanned: 5,
      colorTokenUsage: tokens,
      hardcodedColors: hardcoded,
    });

    expect(summary.hardcodedColorCount).toBe(6);
    expect(summary.hardcodedMatchingTokenCount).toBe(4);
  });

  it('marks the analysis incomplete when it could not run', () => {
    const summary = buildColorTokenSummary({
      analysisComplete: false,
      styleFilesScanned: 0,
      colorTokenUsage: [],
      hardcodedColors: [],
    });

    expect(summary.analysisComplete).toBe(false);
    expect(summary.usageCount).toBe(0);
  });
});
