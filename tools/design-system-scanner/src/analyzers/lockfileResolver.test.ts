import * as path from 'path';
import type { PackageUsage } from '../types';
import { detectLockfileFormat, resolveVersions } from './lockfileResolver';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

describe('lockfileResolver', () => {
  describe('detectLockfileFormat', () => {
    it('detects yarn v1 lockfile', () => {
      const format = detectLockfileFormat(
        path.join(FIXTURES_DIR, 'simple-app'),
      );
      expect(format).toBe('yarn-v1');
    });

    it('returns null when no lockfile exists', () => {
      const format = detectLockfileFormat(path.join(FIXTURES_DIR, 'no-ds-app'));
      expect(format).toBeNull();
    });
  });

  describe('resolveVersions', () => {
    it('resolves versions from yarn v1 lockfile', () => {
      const packages: PackageUsage[] = [
        {
          name: '@entur/button',
          version: '^4.0.3',
          isDev: false,
          isImported: false,
          filesImportingCount: 0,
          symbolCountUsed: 0,
        },
        {
          name: '@entur/tokens',
          version: '^3.22.2',
          isDev: false,
          isImported: false,
          filesImportingCount: 0,
          symbolCountUsed: 0,
        },
        {
          name: '@entur/icons',
          version: '^8.0.0',
          isDev: true,
          isImported: false,
          filesImportingCount: 0,
          symbolCountUsed: 0,
        },
      ];

      resolveVersions(path.join(FIXTURES_DIR, 'simple-app'), packages);

      expect(packages[0].resolvedVersion).toBe('4.0.5');
      expect(packages[1].resolvedVersion).toBe('3.22.5');
      expect(packages[2].resolvedVersion).toBe('8.1.2');
    });

    it('leaves resolvedVersion undefined when no lockfile exists', () => {
      const packages: PackageUsage[] = [
        {
          name: '@entur/button',
          version: '^4.0.3',
          isDev: false,
          isImported: false,
          filesImportingCount: 0,
          symbolCountUsed: 0,
        },
      ];

      resolveVersions(path.join(FIXTURES_DIR, 'no-ds-app'), packages);

      expect(packages[0].resolvedVersion).toBeUndefined();
    });
  });
});
