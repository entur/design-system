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
