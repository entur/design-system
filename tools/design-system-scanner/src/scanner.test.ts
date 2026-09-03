import * as path from 'path';
import { scanRepository, isFrontendRepo } from './scanner';

const FIXTURES_DIR = path.join(__dirname, '__fixtures__');

describe('scanner', () => {
  describe('scanRepository', () => {
    it('produces a complete RepositoryUsage result', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const result = await scanRepository(
        repoDir,
        'test/simple-app',
        'https://github.com/test/simple-app',
        'main',
        '2024-01-01T00:00:00Z',
      );

      expect(result.name).toBe('test/simple-app');
      expect(result.url).toBe('https://github.com/test/simple-app');
      expect(result.defaultBranch).toBe('main');
      expect(result.designSystemPackages.length).toBeGreaterThan(0);
      // react-scanner detects actual JSX instances
      expect(result.componentUsage.length).toBeGreaterThan(0);
    });

    it('returns empty usage for repos without design system', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'no-ds-app');
      const result = await scanRepository(
        repoDir,
        'test/no-ds-app',
        'https://github.com/test/no-ds-app',
        'main',
        '2024-01-01T00:00:00Z',
      );

      expect(result.designSystemPackages).toHaveLength(0);
      expect(result.componentUsage).toHaveLength(0);
      expect(result.importUsage).toHaveLength(0);
    });

    it('detects import style and alias information', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const result = await scanRepository(
        repoDir,
        'test/simple-app',
        'https://github.com/test/simple-app',
        'main',
        '2024-01-01T00:00:00Z',
      );

      // Find PrimaryButton — should be named import, not aliased (from App.tsx)
      const primaryButton = result.componentUsage.find(
        c => c.componentName === 'PrimaryButton',
      );
      if (primaryButton) {
        expect(primaryButton.importStyle).toBe('named');
      }

      // All components should have a valid importStyle
      for (const comp of result.componentUsage) {
        expect(['named', 'default', 'namespace', 'unknown']).toContain(
          comp.importStyle,
        );
      }
    });

    it('enriches package usage with import data', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const result = await scanRepository(
        repoDir,
        'test/simple-app',
        'https://github.com/test/simple-app',
        'main',
        '2024-01-01T00:00:00Z',
      );

      // @entur/button is used in JSX — should be marked as imported
      const button = result.designSystemPackages.find(
        p => p.name === '@entur/button',
      );
      expect(button).toBeDefined();
      expect(button!.isImported).toBe(true);
      expect(button!.symbolCountUsed).toBeGreaterThan(0);
    });

    it('resolves versions from yarn.lock', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const result = await scanRepository(
        repoDir,
        'test/simple-app',
        'https://github.com/test/simple-app',
        'main',
        '2024-01-01T00:00:00Z',
      );

      const button = result.designSystemPackages.find(
        p => p.name === '@entur/button',
      );
      expect(button).toBeDefined();
      expect(button!.resolvedVersion).toBe('4.0.5');

      const tokens = result.designSystemPackages.find(
        p => p.name === '@entur/tokens',
      );
      expect(tokens).toBeDefined();
      expect(tokens!.resolvedVersion).toBe('3.22.5');
    });

    it('detects non-JSX imports (hooks, tokens)', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const result = await scanRepository(
        repoDir,
        'test/simple-app',
        'https://github.com/test/simple-app',
        'main',
        '2024-01-01T00:00:00Z',
      );

      // The import analyzer should find 'colors' from @entur/tokens
      const colorsImport = result.importUsage.find(
        i => i.symbolName === 'colors',
      );
      expect(colorsImport).toBeDefined();
      expect(colorsImport!.symbolType).toBe('token');
      expect(colorsImport!.referenceCount).toBeGreaterThan(0);
    });

    it('detects monorepo flag', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'monorepo-app');
      const result = await scanRepository(
        repoDir,
        'test/monorepo-app',
        'https://github.com/test/monorepo-app',
        'main',
        '2024-01-01T00:00:00Z',
        {
          visibility: 'private',
          archived: false,
          primaryLanguage: 'TypeScript',
          createdAt: '2020-01-01T00:00:00Z',
          pushedAt: '2024-01-01T00:00:00Z',
          isMonorepo: false,
          framework: null,
          reactVersion: null,
          codeOwners: [],
          ownerTeams: [],
          ownerTeamsSource: 'none',
        },
      );

      expect(result.repoMetadata).toBeDefined();
      expect(result.repoMetadata!.isMonorepo).toBe(true);
    });

    it('detects workspaces in monorepo', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'monorepo-app');
      const result = await scanRepository(
        repoDir,
        'test/monorepo-app',
        'https://github.com/test/monorepo-app',
        'main',
        '2024-01-01T00:00:00Z',
      );

      expect(result.workspaces.length).toBeGreaterThan(0);

      const dashboard = result.workspaces.find(
        w => w.path === 'apps/dashboard',
      );
      if (dashboard) {
        expect(dashboard.type).toBe('app');
      }

      const web = result.workspaces.find(w => w.path === 'packages/web');
      if (web) {
        expect(web.type).toBe('package');
      }
    });

    it('resolves reactVersion from lockfile when repoMetadata is provided', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const result = await scanRepository(
        repoDir,
        'test/simple-app',
        'https://github.com/test/simple-app',
        'main',
        '2024-01-01T00:00:00Z',
        {
          visibility: 'private',
          archived: false,
          primaryLanguage: 'TypeScript',
          createdAt: '2020-01-01T00:00:00Z',
          pushedAt: '2024-01-01T00:00:00Z',
          isMonorepo: false,
          framework: null,
          reactVersion: null,
          codeOwners: [],
          ownerTeams: [],
          ownerTeamsSource: 'none',
        },
      );

      // simple-app fixture has react@^18.2.0 in package.json resolved to 18.2.0 in yarn.lock
      expect(result.repoMetadata!.reactVersion).toBe('18.2.0');
    });

    it('collects file findings when flag is set', async () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const result = await scanRepository(
        repoDir,
        'test/simple-app',
        'https://github.com/test/simple-app',
        'main',
        '2024-01-01T00:00:00Z',
        undefined,
        { includeFileFindings: true },
      );

      expect(result.fileFindings).toBeDefined();
      expect(result.fileFindings!.length).toBeGreaterThan(0);

      // Each finding should have a relative file path, not absolute
      for (const finding of result.fileFindings!) {
        expect(finding.filePath).not.toContain('/Users/');
        expect(finding.fileExtension).toBeTruthy();
      }
    });
  });

  describe('isFrontendRepo', () => {
    it('returns true for repos with React dependency', () => {
      expect(isFrontendRepo({ dependencies: { react: '^18.0.0' } })).toBe(true);
    });

    it('returns true for repos with Next.js', () => {
      expect(isFrontendRepo({ dependencies: { next: '^14.0.0' } })).toBe(true);
    });

    it('returns true for repos with Gatsby', () => {
      expect(isFrontendRepo({ dependencies: { gatsby: '^5.0.0' } })).toBe(true);
    });

    it('returns false for backend-only repos', () => {
      expect(isFrontendRepo({ dependencies: { express: '^4.0.0' } })).toBe(
        false,
      );
    });

    it('returns true if React is in devDependencies', () => {
      expect(isFrontendRepo({ devDependencies: { react: '^18.0.0' } })).toBe(
        true,
      );
    });
  });
});

describe('scanner rollups', () => {
  const scanTypographyApp = () =>
    scanRepository(
      path.join(FIXTURES_DIR, 'typography-beta-app'),
      'test/typography-beta-app',
      'https://github.com/test/typography-beta-app',
      'main',
      '2024-01-01T00:00:00Z',
    );

  it('reports adoption of the new typography end to end', async () => {
    const result = await scanTypographyApp();
    const summary = result.typographySummary;

    expect(summary.hasPackage).toBe(true);
    expect(summary.usesNewTypography).toBe(true);
    expect(summary.usesLegacyTypography).toBe(true);
    expect(summary.newInstanceCount).toBeGreaterThan(0);
    expect(summary.legacyInstanceCount).toBeGreaterThan(0);
    expect(summary.newShare).toBeGreaterThan(0);
    expect(summary.newShare).toBeLessThan(1);
  });

  it('counts typography class overrides from every source', async () => {
    const result = await scanTypographyApp();
    const summary = result.typographySummary;

    expect(summary.classOverrideBetaCount).toBeGreaterThan(0);
    expect(summary.classOverrideLegacyCount).toBeGreaterThan(0);

    const sources = new Set(
      result.cssOverrides
        .filter(o => o.packageName === '@entur/typography')
        .map(o => o.source),
    );
    expect([...sources].sort()).toEqual([
      'css-in-js',
      'jsx-classname',
      'stylesheet',
    ]);
  });

  it('reports the root package for a deep import', async () => {
    const result = await scanTypographyApp();

    const heading = result.componentUsage.find(
      c => c.componentName === 'Heading',
    )!;
    expect(heading.packageName).toBe('@entur/typography');
    expect(heading.deepImportPath).toBe('/beta');

    // No component or symbol may report a subpath as its package
    for (const component of result.componentUsage) {
      expect(component.packageName).not.toContain('/beta');
    }
    for (const imported of result.importUsage) {
      expect(imported.packageName).not.toContain('/beta');
    }
  });

  it('does not report an asset import as package usage', async () => {
    // @entur/typography/fonts/...woff2?url was showing up as a package with a
    // "default" symbol
    const result = await scanTypographyApp();

    const fontImports = result.importUsage.filter(
      i => i.symbolName === 'default',
    );
    expect(fontImports).toHaveLength(0);
  });

  it('maps colour token usage even without a colour-heavy repo', async () => {
    const result = await scanRepository(
      path.join(FIXTURES_DIR, 'color-token-app'),
      'test/color-token-app',
      'https://github.com/test/color-token-app',
      'main',
      '2024-01-01T00:00:00Z',
    );

    expect(result.colorTokenSummary.analysisComplete).toBe(true);
    expect(result.colorTokenSummary.usageCount).toBeGreaterThan(0);
    expect(result.colorTokenSummary.legacyTokenCount).toBeGreaterThan(0);
    expect(result.colorTokenSummary.newTokenCount).toBeGreaterThan(0);
    expect(
      result.colorTokenSummary.hardcodedMatchingTokenCount,
    ).toBeGreaterThan(0);
  });

  it('reports no scanned files when the catalogue is unavailable', async () => {
    // analysisComplete: false has to mean the colour analysis did not run, so
    // the file count must not be borrowed from an analyzer that did
    const result = await scanRepository(
      path.join(FIXTURES_DIR, 'color-token-app'),
      'test/color-token-app',
      'https://github.com/test/color-token-app',
      'main',
      '2024-01-01T00:00:00Z',
      undefined,
      { styleCatalog: null },
    );

    expect(result.colorTokenSummary.analysisComplete).toBe(false);
    expect(result.colorTokenSummary.styleFilesScanned).toBe(0);
    expect(result.colorTokenSummary.usageCount).toBe(0);
  });

  it('still maps colours for a repo with no design system dependency', async () => {
    // The colour mapping is meant to cover the estate, not just consumers, so
    // it must run before the no-@entur/* early return
    const result = await scanRepository(
      path.join(FIXTURES_DIR, 'no-ds-app'),
      'test/no-ds-app',
      'https://github.com/test/no-ds-app',
      'main',
      '2024-01-01T00:00:00Z',
    );

    expect(result.designSystemPackages).toHaveLength(0);
    expect(result.colorTokenSummary.analysisComplete).toBe(true);
    expect(result.typographySummary.hasPackage).toBe(false);
  });

  it('prefers the provided owning teams over CODEOWNERS', async () => {
    const result = await scanRepository(
      path.join(FIXTURES_DIR, 'simple-app'),
      'test/simple-app',
      'https://github.com/test/simple-app',
      'main',
      '2024-01-01T00:00:00Z',
      {
        visibility: 'private',
        archived: false,
        primaryLanguage: 'TypeScript',
        createdAt: '2024-01-01T00:00:00Z',
        pushedAt: '2024-01-01T00:00:00Z',
        isMonorepo: false,
        framework: null,
        reactVersion: null,
        codeOwners: [],
        ownerTeams: [],
        ownerTeamsSource: 'none',
      },
      { ownerTeams: ['@entur/team-designsystem'] },
    );

    expect(result.repoMetadata?.ownerTeams).toEqual([
      '@entur/team-designsystem',
    ]);
    expect(result.repoMetadata?.ownerTeamsSource).toBe('org-team');
  });
});
