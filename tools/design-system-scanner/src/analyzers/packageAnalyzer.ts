import * as fs from 'fs';
import * as path from 'path';
import type { PackageUsage, LibraryUsage, WorkspaceInfo } from '../types';

/**
 * The @entur/* packages that belong to the design system (published from this repo).
 * Other @entur/* packages (e.g. @entur/auth, @entur/sdk) belong to other teams.
 */
export const DESIGN_SYSTEM_PACKAGES = new Set([
  '@entur/a11y',
  '@entur/alert',
  '@entur/button',
  '@entur/chip',
  '@entur/datepicker',
  '@entur/dropdown',
  '@entur/expand',
  '@entur/fileupload',
  '@entur/form',
  '@entur/grid',
  '@entur/icons',
  '@entur/layout',
  '@entur/loader',
  '@entur/menu',
  '@entur/modal',
  '@entur/styles',
  '@entur/tab',
  '@entur/table',
  '@entur/tokens',
  '@entur/tooltip',
  '@entur/travel',
  '@entur/typography',
  '@entur/utils',
]);

/**
 * Known UI libraries to detect in addition to @entur/* packages.
 * Maps package name patterns to their category.
 */
const KNOWN_UI_LIBRARIES: Record<string, string> = {
  '@mui/material': 'UI Framework',
  '@mui/icons-material': 'Icon Library',
  '@mui/lab': 'UI Framework',
  '@mui/system': 'Styling',
  '@mui/joy': 'UI Framework',
  '@chakra-ui/react': 'UI Framework',
  antd: 'UI Framework',
  '@ant-design/icons': 'Icon Library',
  'react-bootstrap': 'UI Framework',
  'semantic-ui-react': 'UI Framework',
  '@headlessui/react': 'UI Framework',
  '@radix-ui/react-*': 'UI Primitives',
  'styled-components': 'CSS-in-JS',
  '@emotion/react': 'CSS-in-JS',
  '@emotion/styled': 'CSS-in-JS',
  tailwindcss: 'Utility CSS',
  '@mantine/core': 'UI Framework',
  'react-aria': 'UI Primitives',
  'react-icons': 'Icon Library',
  'framer-motion': 'Animation',
  'react-spring': 'Animation',
  recharts: 'Charts',
  'react-chartjs-2': 'Charts',
  '@nivo/core': 'Charts',
  'react-table': 'Table',
  '@tanstack/react-table': 'Table',
  'react-hook-form': 'Forms',
  formik: 'Forms',
  'react-select': 'Forms',
  'react-datepicker': 'Date Picker',
  'react-modal': 'Modal',
  'react-tooltip': 'Tooltip',
  'react-toastify': 'Notifications',
  'react-hot-toast': 'Notifications',
};

/** Framework detection: maps dependency name to framework identifier. */
const FRAMEWORK_INDICATORS: Record<string, string> = {
  next: 'next',
  gatsby: 'gatsby',
  '@remix-run/react': 'remix',
  'react-scripts': 'cra',
};

/**
 * Analyze a repository's package.json for @entur/* design system dependencies
 * and other major UI libraries.
 */
export function analyzePackageJson(repoDir: string): {
  designSystemPackages: PackageUsage[];
  otherUILibraries: LibraryUsage[];
  isMonorepo: boolean;
} {
  const designSystemPackages: PackageUsage[] = [];
  const otherUILibraries: LibraryUsage[] = [];

  const packageJsonPaths = findPackageJsonFiles(repoDir);
  const isMonorepo = packageJsonPaths.length > 1;

  for (const pkgPath of packageJsonPaths) {
    try {
      const content = fs.readFileSync(pkgPath, 'utf-8');
      const pkg = JSON.parse(content);

      collectDeps(
        pkg.dependencies,
        false,
        designSystemPackages,
        otherUILibraries,
      );
      collectDeps(
        pkg.devDependencies,
        true,
        designSystemPackages,
        otherUILibraries,
      );
    } catch {
      // Skip malformed package.json files
    }
  }

  return {
    designSystemPackages: deduplicatePackages(designSystemPackages),
    otherUILibraries: deduplicateLibraries(otherUILibraries),
    isMonorepo,
  };
}

/**
 * Detect the declared React version range from a package.json in the given directory.
 * Works for either a repository root or an individual workspace directory.
 * Returns the version string as declared (e.g. "^18.2.0"), not the resolved version.
 * Lockfile resolution is done separately in scanner.ts.
 * Prefers dependencies over devDependencies when both declare react.
 */
export function detectReactVersion(repoDir: string): string | null {
  try {
    const rootPkgPath = path.join(repoDir, 'package.json');
    if (!fs.existsSync(rootPkgPath)) return null;
    const pkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
    return (
      (pkg.dependencies?.['react'] as string | undefined) ??
      (pkg.devDependencies?.['react'] as string | undefined) ??
      null
    );
  } catch {
    return null;
  }
}

/**
 * Detect the frontend framework used in a repository.
 * Checks the root package.json dependencies and devDependencies.
 */
export function detectFramework(repoDir: string): string | null {
  try {
    const rootPkgPath = path.join(repoDir, 'package.json');
    if (!fs.existsSync(rootPkgPath)) return null;

    const pkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    for (const [dep, framework] of Object.entries(FRAMEWORK_INDICATORS)) {
      if (dep in allDeps) return framework;
    }

    // Vite detection: check for vite + a React plugin
    if ('vite' in allDeps) {
      const hasReactPlugin =
        '@vitejs/plugin-react' in allDeps ||
        '@vitejs/plugin-react-swc' in allDeps;
      if (hasReactPlugin) return 'vite';
    }
  } catch {
    // Skip on error
  }

  return null;
}

/**
 * Detect workspaces in a monorepo.
 *
 * Checks for:
 * 1. yarn/npm workspaces (package.json "workspaces" field)
 * 2. pnpm workspaces (pnpm-workspace.yaml)
 * 3. lerna packages (lerna.json)
 */
export function detectWorkspaces(repoDir: string): WorkspaceInfo[] {
  try {
    const rootPkgPath = path.join(repoDir, 'package.json');
    if (!fs.existsSync(rootPkgPath)) return [];

    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));

    // 1. yarn/npm workspaces
    if (rootPkg.workspaces) {
      const patterns = Array.isArray(rootPkg.workspaces)
        ? rootPkg.workspaces
        : rootPkg.workspaces.packages || [];
      return resolveWorkspaceGlobs(repoDir, patterns);
    }

    // 2. pnpm workspaces
    const pnpmPath = path.join(repoDir, 'pnpm-workspace.yaml');
    if (fs.existsSync(pnpmPath)) {
      const content = fs.readFileSync(pnpmPath, 'utf-8');
      const patterns = parsePnpmWorkspacePackages(content);
      return resolveWorkspaceGlobs(repoDir, patterns);
    }

    // 3. lerna
    const lernaPath = path.join(repoDir, 'lerna.json');
    if (fs.existsSync(lernaPath)) {
      const lerna = JSON.parse(fs.readFileSync(lernaPath, 'utf-8'));
      const patterns = lerna.packages || ['packages/*'];
      return resolveWorkspaceGlobs(repoDir, patterns);
    }
  } catch {
    // Skip on error
  }

  return [];
}

/**
 * Parse the packages array from pnpm-workspace.yaml without a YAML dependency.
 * Expected format:
 *   packages:
 *     - 'apps/*'
 *     - 'packages/*'
 */
function parsePnpmWorkspacePackages(content: string): string[] {
  const patterns: string[] = [];
  const lines = content.split('\n');
  let inPackages = false;

  for (const line of lines) {
    if (/^packages\s*:/.test(line)) {
      inPackages = true;
      continue;
    }
    if (inPackages) {
      const match = line.match(/^\s+-\s+['"]?([^'"]+)['"]?\s*$/);
      if (match) {
        patterns.push(match[1]);
      } else if (
        line.trim() &&
        !line.startsWith(' ') &&
        !line.startsWith('\t')
      ) {
        // Hit next top-level key, stop
        break;
      }
    }
  }

  return patterns;
}

/**
 * Resolve workspace glob patterns to actual workspace entries.
 * Supports simple patterns like "apps/*", "packages/*".
 */
function resolveWorkspaceGlobs(
  repoDir: string,
  patterns: string[],
): WorkspaceInfo[] {
  const workspaces: WorkspaceInfo[] = [];

  for (const pattern of patterns) {
    // Simple glob: "apps/*" or "packages/*" — resolve the parent dir and list children
    const cleanPattern = pattern.replace(/\/?\*+$/, '');
    const parentDir = path.join(repoDir, cleanPattern);

    if (!fs.existsSync(parentDir) || !fs.statSync(parentDir).isDirectory()) {
      continue;
    }

    try {
      const entries = fs.readdirSync(parentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

        const wsDir = path.join(parentDir, entry.name);
        const wsPkgPath = path.join(wsDir, 'package.json');
        if (!fs.existsSync(wsPkgPath)) continue;

        try {
          const pkg = JSON.parse(fs.readFileSync(wsPkgPath, 'utf-8'));
          const relativePath = path.relative(repoDir, wsDir);
          const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
          const dsCount = Object.keys(allDeps).filter(d =>
            DESIGN_SYSTEM_PACKAGES.has(d),
          ).length;

          workspaces.push({
            name: pkg.name || entry.name,
            path: relativePath,
            type: classifyWorkspaceType(relativePath),
            framework: detectWorkspaceFramework(allDeps),
            dsPackageCount: dsCount,
          });
        } catch {
          // Skip malformed package.json
        }
      }
    } catch {
      // Skip inaccessible directories
    }
  }

  return workspaces;
}

/** Classify workspace type based on its path convention. */
function classifyWorkspaceType(
  relativePath: string,
): 'app' | 'package' | 'unknown' {
  const normalized = relativePath.toLowerCase();
  if (normalized.startsWith('apps/') || normalized.startsWith('app/')) {
    return 'app';
  }
  if (
    normalized.startsWith('packages/') ||
    normalized.startsWith('libs/') ||
    normalized.startsWith('lib/')
  ) {
    return 'package';
  }
  return 'unknown';
}

/** Detect framework from a workspace's dependencies. */
function detectWorkspaceFramework(deps: Record<string, string>): string | null {
  for (const [dep, framework] of Object.entries(FRAMEWORK_INDICATORS)) {
    if (dep in deps) return framework;
  }
  if ('vite' in deps) {
    if ('@vitejs/plugin-react' in deps || '@vitejs/plugin-react-swc' in deps) {
      return 'vite';
    }
  }
  return null;
}

/** Directories to skip when searching for package.json files. */
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.cache',
  '.turbo',
  '.nx',
  'coverage',
  'out',
  'storybook-static',
]);

/**
 * Recursively find all package.json files in a directory,
 * skipping node_modules and other build/cache directories.
 * Limits depth to 4 levels to avoid excessive traversal.
 */
export function findPackageJsonFiles(dir: string, depth = 0): string[] {
  if (depth > 4) return [];

  const results: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'package.json' && entry.isFile()) {
        results.push(path.join(dir, entry.name));
      } else if (
        entry.isDirectory() &&
        !SKIP_DIRS.has(entry.name) &&
        !entry.name.startsWith('.')
      ) {
        results.push(
          ...findPackageJsonFiles(path.join(dir, entry.name), depth + 1),
        );
      }
    }
  } catch {
    // Skip inaccessible directories
  }

  return results;
}

/**
 * Collect design system and UI library dependencies from a dependencies object.
 */
function collectDeps(
  deps: Record<string, string> | undefined,
  isDev: boolean,
  designSystemPackages: PackageUsage[],
  otherUILibraries: LibraryUsage[],
): void {
  if (!deps) return;

  for (const [name, version] of Object.entries(deps)) {
    if (DESIGN_SYSTEM_PACKAGES.has(name)) {
      designSystemPackages.push({
        name,
        version,
        isDev,
        isImported: false,
        filesImportingCount: 0,
        symbolCountUsed: 0,
      });
    } else {
      const category = matchUILibrary(name);
      if (category) {
        otherUILibraries.push({ name, version, category });
      }
    }
  }
}

/**
 * Match a package name against known UI libraries.
 * Supports wildcard patterns (e.g., "@radix-ui/react-*").
 */
function matchUILibrary(name: string): string | undefined {
  // Direct match
  if (KNOWN_UI_LIBRARIES[name]) {
    return KNOWN_UI_LIBRARIES[name];
  }

  // Wildcard match
  for (const [pattern, category] of Object.entries(KNOWN_UI_LIBRARIES)) {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (name.startsWith(prefix)) {
        return category;
      }
    }
  }

  return undefined;
}

/**
 * Deduplicate package entries, preferring non-dev over dev.
 */
function deduplicatePackages(packages: PackageUsage[]): PackageUsage[] {
  const map = new Map<string, PackageUsage>();
  for (const pkg of packages) {
    const existing = map.get(pkg.name);
    if (!existing || (!pkg.isDev && existing.isDev)) {
      map.set(pkg.name, pkg);
    }
  }
  return Array.from(map.values());
}

/**
 * Deduplicate library entries.
 */
function deduplicateLibraries(libraries: LibraryUsage[]): LibraryUsage[] {
  const map = new Map<string, LibraryUsage>();
  for (const lib of libraries) {
    if (!map.has(lib.name)) {
      map.set(lib.name, lib);
    }
  }
  return Array.from(map.values());
}
