import * as path from 'path';
import {
  analyzePackageJson,
  detectFramework,
  detectWorkspaces,
} from './packageAnalyzer';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

describe('packageAnalyzer', () => {
  describe('analyzePackageJson', () => {
    it('detects @entur/* design system packages', () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const { designSystemPackages } = analyzePackageJson(repoDir);

      expect(designSystemPackages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: '@entur/button',
            version: '^4.0.3',
            isDev: false,
          }),
          expect.objectContaining({
            name: '@entur/typography',
            version: '^2.1.4',
            isDev: false,
          }),
          expect.objectContaining({
            name: '@entur/tokens',
            version: '^3.22.2',
            isDev: false,
          }),
          expect.objectContaining({
            name: '@entur/icons',
            version: '^8.0.0',
            isDev: true,
          }),
        ]),
      );
    });

    it('initializes new PackageUsage fields', () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const { designSystemPackages } = analyzePackageJson(repoDir);

      for (const pkg of designSystemPackages) {
        expect(pkg.isImported).toBe(false);
        expect(pkg.filesImportingCount).toBe(0);
        expect(pkg.symbolCountUsed).toBe(0);
      }
    });

    it('detects known UI libraries', () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const { otherUILibraries } = analyzePackageJson(repoDir);

      expect(otherUILibraries).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'styled-components',
            category: 'CSS-in-JS',
          }),
        ]),
      );
    });

    it('handles monorepo with sub-packages', () => {
      const repoDir = path.join(FIXTURES_DIR, 'monorepo-app');
      const { designSystemPackages, otherUILibraries, isMonorepo } =
        analyzePackageJson(repoDir);

      expect(isMonorepo).toBe(true);

      const packageNames = designSystemPackages.map(p => p.name);
      expect(packageNames).toContain('@entur/button');
      expect(packageNames).toContain('@entur/dropdown');
      expect(packageNames).toContain('@entur/table');
      expect(packageNames).toContain('@entur/typography');

      const libNames = otherUILibraries.map(l => l.name);
      expect(libNames).toContain('@mui/material');
      expect(libNames).toContain('recharts');
    });

    it('returns empty arrays for non-design-system repos', () => {
      const repoDir = path.join(FIXTURES_DIR, 'no-ds-app');
      const { designSystemPackages, otherUILibraries } =
        analyzePackageJson(repoDir);

      expect(designSystemPackages).toHaveLength(0);
      expect(otherUILibraries).toHaveLength(0);
    });

    it('deduplicates packages across sub-packages', () => {
      const repoDir = path.join(FIXTURES_DIR, 'monorepo-app');
      const { designSystemPackages } = analyzePackageJson(repoDir);

      // @entur/button appears in both root context and packages/web
      const buttonEntries = designSystemPackages.filter(
        p => p.name === '@entur/button',
      );
      expect(buttonEntries).toHaveLength(1);
    });

    it('detects single-package repos as non-monorepo', () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const { isMonorepo } = analyzePackageJson(repoDir);
      expect(isMonorepo).toBe(false);
    });
  });

  describe('detectFramework', () => {
    it('returns null for repos without a known framework', () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      expect(detectFramework(repoDir)).toBeNull();
    });

    it('returns null for non-existent directory', () => {
      expect(detectFramework('/nonexistent')).toBeNull();
    });
  });

  describe('detectWorkspaces', () => {
    it('detects yarn workspaces from package.json', () => {
      const repoDir = path.join(FIXTURES_DIR, 'monorepo-app');
      const workspaces = detectWorkspaces(repoDir);

      expect(workspaces.length).toBeGreaterThan(0);

      const dashboard = workspaces.find(w => w.path === 'apps/dashboard');
      expect(dashboard).toBeDefined();
      expect(dashboard!.type).toBe('app');

      const web = workspaces.find(w => w.path === 'packages/web');
      expect(web).toBeDefined();
      expect(web!.type).toBe('package');
    });

    it('returns empty for non-workspace repos', () => {
      const repoDir = path.join(FIXTURES_DIR, 'simple-app');
      const workspaces = detectWorkspaces(repoDir);
      expect(workspaces).toHaveLength(0);
    });

    it('counts design system packages per workspace', () => {
      const repoDir = path.join(FIXTURES_DIR, 'monorepo-app');
      const workspaces = detectWorkspaces(repoDir);

      for (const ws of workspaces) {
        expect(typeof ws.dsPackageCount).toBe('number');
      }
    });
  });
});
