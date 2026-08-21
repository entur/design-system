import * as path from 'path';
import { analyzeImports } from './importAnalyzer';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

describe('importAnalyzer', () => {
  it('detects token imports from @entur/tokens', async () => {
    const repoDir = path.join(FIXTURES_DIR, 'simple-app');
    const { imports } = await analyzeImports(repoDir);

    const colorsImport = imports.find(i => i.symbolName === 'colors');
    expect(colorsImport).toBeDefined();
    expect(colorsImport!.packageName).toBe('@entur/tokens');
    expect(colorsImport!.symbolType).toBe('token');
    expect(colorsImport!.importStyle).toBe('named');
    expect(colorsImport!.referenceCount).toBeGreaterThan(0);
  });

  it('detects hook imports', async () => {
    const repoDir = path.join(FIXTURES_DIR, 'simple-app');
    const { imports } = await analyzeImports(repoDir);

    const hookImport = imports.find(i => i.symbolName === 'useRandomId');
    expect(hookImport).toBeDefined();
    expect(hookImport!.symbolType).toBe('hook');
    expect(hookImport!.packageName).toBe('@entur/utils');
  });

  it('detects aliased imports', async () => {
    const repoDir = path.join(FIXTURES_DIR, 'simple-app');
    const { imports } = await analyzeImports(repoDir);

    const aliased = imports.find(
      i => i.symbolName === 'PrimaryButton' && i.isAliased,
    );
    expect(aliased).toBeDefined();
    expect(aliased!.aliasName).toBe('MainButton');
  });

  it('detects component imports', async () => {
    const repoDir = path.join(FIXTURES_DIR, 'simple-app');
    const { imports } = await analyzeImports(repoDir);

    const components = imports.filter(i => i.symbolType === 'component');
    expect(components.length).toBeGreaterThan(0);

    // PrimaryButton should be detected as a component
    const primaryButton = imports.find(i => i.symbolName === 'PrimaryButton');
    expect(primaryButton).toBeDefined();
    expect(primaryButton!.symbolType).toBe('component');
  });

  it('counts files correctly across multiple files', async () => {
    const repoDir = path.join(FIXTURES_DIR, 'simple-app');
    const { imports } = await analyzeImports(repoDir);

    // PrimaryButton is imported in both App.tsx and Header.tsx (and AliasedImport.tsx as alias)
    const primaryButton = imports.find(
      i => i.symbolName === 'PrimaryButton' && !i.isAliased,
    );
    if (primaryButton) {
      expect(primaryButton.filesUsedIn).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns empty results for repos without design system', async () => {
    const repoDir = path.join(FIXTURES_DIR, 'no-ds-app');
    const { imports } = await analyzeImports(repoDir);

    expect(imports).toHaveLength(0);
  });

  it('collects file findings when flag is set', async () => {
    const repoDir = path.join(FIXTURES_DIR, 'simple-app');
    const { fileFindings } = await analyzeImports(repoDir, true);

    expect(fileFindings.length).toBeGreaterThan(0);

    // All findings should have relative paths
    for (const finding of fileFindings) {
      expect(finding.filePath).not.toContain('/Users/');
      expect(finding.findingType).toBe('import');
    }
  });

  describe('file findings mode', () => {
    const deepImportApp = path.join(FIXTURES_DIR, 'deep-import-app');

    it('keeps test files out of the aggregate while collecting them as findings', async () => {
      // Findings mode widens the crawl; the aggregate must not change with it.
      const withFindings = await analyzeImports(deepImportApp, true);
      const withoutFindings = await analyzeImports(deepImportApp, false);

      const byName = (result: Awaited<ReturnType<typeof analyzeImports>>) =>
        [...result.imports].sort((a, b) =>
          a.symbolName.localeCompare(b.symbolName),
        );

      // Compares reference and file counts too: the fixture's test file imports
      // Table, which TableView.tsx also imports, so a leak inflates an existing
      // symbol instead of adding a name.
      expect(byName(withFindings)).toEqual(byName(withoutFindings));
      expect(byName(withFindings).map(i => i.symbolName)).not.toContain(
        'EditableCell',
      );

      const testFindings = withFindings.fileFindings.filter(f => f.isTestFile);
      expect(testFindings.length).toBeGreaterThan(0);
      expect(testFindings.map(f => f.symbolName)).toContain('EditableCell');
    });

    it('collects no findings when the flag is off', async () => {
      const { fileFindings } = await analyzeImports(deepImportApp, false);
      expect(fileFindings).toEqual([]);
    });
  });
});
