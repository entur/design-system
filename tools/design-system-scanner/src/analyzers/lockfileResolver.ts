import * as fs from 'fs';
import * as path from 'path';
import type { PackageUsage } from '../types';

type LockfileFormat = 'yarn-v1' | 'yarn-berry' | 'npm' | null;

/** Detect which lockfile format a repo uses. */
export function detectLockfileFormat(repoDir: string): LockfileFormat {
  const yarnLockPath = path.join(repoDir, 'yarn.lock');
  if (fs.existsSync(yarnLockPath)) {
    // Yarn Berry lockfiles start with a __metadata: block
    const head = fs.readFileSync(yarnLockPath, 'utf8').slice(0, 500);
    return head.includes('__metadata:') ? 'yarn-berry' : 'yarn-v1';
  }

  const pkgLockPath = path.join(repoDir, 'package-lock.json');
  if (fs.existsSync(pkgLockPath)) return 'npm';

  // pnpm-lock.yaml not supported yet (can be added if needed)
  return null;
}

/**
 * Parse a Yarn v1 lockfile and extract resolved versions for the given packages.
 *
 * Yarn v1 format:
 *   "@entur/button@^4.0.3":
 *     version "4.0.5"
 *     resolved "https://..."
 */
function resolveFromYarnV1(repoDir: string, packages: PackageUsage[]): void {
  try {
    // @yarnpkg/lockfile provides a parse() function for v1 format
    const lockfileModule = require('@yarnpkg/lockfile');
    const content = fs.readFileSync(path.join(repoDir, 'yarn.lock'), 'utf8');
    const parsed = lockfileModule.parse(content);

    if (parsed.type !== 'success' || !parsed.object) {
      console.warn('  [lockfile] Failed to parse yarn.lock (v1)');
      return;
    }

    const entries = parsed.object as Record<string, { version?: string }>;

    for (const pkg of packages) {
      // Keys look like "@entur/button@^4.0.3" or "@entur/button@^4.0.3, @entur/button@^4.0.0"
      const key = Object.keys(entries).find(k =>
        k.split(', ').some(part => part === `${pkg.name}@${pkg.version}`),
      );
      if (key && entries[key].version) {
        pkg.resolvedVersion = entries[key].version;
      }
    }
  } catch (error) {
    console.warn(
      '  [lockfile] Error parsing yarn.lock (v1):',
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Parse a Yarn Berry (v2+/v4) lockfile and extract resolved versions.
 *
 * Berry format is YAML with keys like:
 *   "@entur/button@npm:^4.0.3":
 *     version: 4.0.5
 *     resolution: "@entur/button@npm:4.0.5"
 */
function resolveFromYarnBerry(repoDir: string, packages: PackageUsage[]): void {
  try {
    const jsYaml = require('js-yaml');
    const content = fs.readFileSync(path.join(repoDir, 'yarn.lock'), 'utf8');
    const parsed = jsYaml.load(content) as Record<
      string,
      { version?: string } | unknown
    >;

    if (!parsed || typeof parsed !== 'object') {
      console.warn('  [lockfile] Failed to parse yarn.lock (Berry)');
      return;
    }

    for (const pkg of packages) {
      // Berry keys use @npm: protocol, e.g. "@entur/button@npm:^4.0.3"
      const key = Object.keys(parsed).find(
        k =>
          k === `${pkg.name}@npm:${pkg.version}` ||
          k.split(', ').some(part => part === `${pkg.name}@npm:${pkg.version}`),
      );
      if (key) {
        const entry = parsed[key] as { version?: string };
        if (entry?.version) {
          pkg.resolvedVersion = String(entry.version);
        }
      }
    }
  } catch (error) {
    console.warn(
      '  [lockfile] Error parsing yarn.lock (Berry):',
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Parse an npm package-lock.json and extract resolved versions.
 */
function resolveFromNpm(repoDir: string, packages: PackageUsage[]): void {
  try {
    const content = fs.readFileSync(
      path.join(repoDir, 'package-lock.json'),
      'utf8',
    );
    const lockfile = JSON.parse(content) as {
      lockfileVersion?: number;
      packages?: Record<string, { version?: string }>;
      dependencies?: Record<string, { version?: string }>;
    };

    for (const pkg of packages) {
      // lockfileVersion 3 uses "packages" with node_modules/ prefix
      const fromPackages =
        lockfile.packages?.[`node_modules/${pkg.name}`]?.version;
      // lockfileVersion 1/2 uses "dependencies"
      const fromDeps = lockfile.dependencies?.[pkg.name]?.version;
      const resolved = fromPackages || fromDeps;
      if (resolved) {
        pkg.resolvedVersion = resolved;
      }
    }
  } catch (error) {
    console.warn(
      '  [lockfile] Error parsing package-lock.json:',
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Resolve actual installed versions for @entur/* packages from the lockfile.
 *
 * Mutates each PackageUsage to set `resolvedVersion` if found.
 * Supports Yarn v1, Yarn Berry, and npm. Skips gracefully for other formats.
 */
export function resolveVersions(
  repoDir: string,
  packages: PackageUsage[],
): void {
  const format = detectLockfileFormat(repoDir);

  switch (format) {
    case 'yarn-v1':
      resolveFromYarnV1(repoDir, packages);
      break;
    case 'yarn-berry':
      resolveFromYarnBerry(repoDir, packages);
      break;
    case 'npm':
      resolveFromNpm(repoDir, packages);
      break;
    default:
      // No supported lockfile found — resolved versions will be undefined
      break;
  }
}
