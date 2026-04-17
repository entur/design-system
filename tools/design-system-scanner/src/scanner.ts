import {
  analyzePackageJson,
  detectFramework,
  detectWorkspaces,
} from './analyzers/packageAnalyzer';
import { analyzeComponents } from './analyzers/reactScannerAnalyzer';
import { analyzeImports } from './analyzers/importAnalyzer';
import { resolveVersions } from './analyzers/lockfileResolver';
import { analyzeCssOverrides } from './analyzers/cssOverrideAnalyzer';
import type {
  RepositoryUsage,
  RepoMetadata,
  PackageUsage,
  ComponentUsage,
  ImportUsage,
} from './types';

export interface ScanOptions {
  /** Whether to collect per-file findings */
  includeFileFindings?: boolean;
}

/**
 * Scan a single repository directory for design system usage.
 *
 * This is the core scanning logic that analyzes:
 * 1. package.json for @entur/* dependencies and other UI libraries
 * 2. Lockfile for resolved versions
 * 3. Source files for JSX component usage via react-scanner (AST-based)
 * 4. Source files for non-JSX import usage via TypeScript AST
 * 5. Workspace structure for monorepos
 */
export async function scanRepository(
  repoDir: string,
  repoName: string,
  repoUrl: string,
  defaultBranch: string,
  lastCommitDate: string,
  repoMetadata?: RepoMetadata,
  options: ScanOptions = {},
): Promise<RepositoryUsage> {
  // 1. Analyze package.json dependencies
  const { designSystemPackages, otherUILibraries, isMonorepo } =
    analyzePackageJson(repoDir);

  // 2. Detect framework and workspaces
  const framework = detectFramework(repoDir);
  const workspaces = detectWorkspaces(repoDir);

  // Enrich repo metadata with detected fields
  const enrichedMetadata: RepoMetadata | undefined = repoMetadata
    ? {
        ...repoMetadata,
        isMonorepo,
        framework: repoMetadata.framework || framework,
      }
    : undefined;

  // CSS overrides are always scanned — cheap regex, useful regardless of DS package presence
  const { findings: cssOverrides } = analyzeCssOverrides(repoDir);

  // Skip deeper analysis if no design system packages found
  if (designSystemPackages.length === 0) {
    return {
      name: repoName,
      url: repoUrl,
      defaultBranch,
      lastCommitDate,
      repoMetadata: enrichedMetadata,
      workspaces,
      designSystemPackages: [],
      otherUILibraries,
      componentUsage: [],
      importUsage: [],
      cssOverrides,
    };
  }

  // 3. Resolve actual installed versions from lockfile
  resolveVersions(repoDir, designSystemPackages);

  // 4. Analyze JSX component usage via react-scanner (AST-based)
  const { components: componentUsage, fileFindings: reactScannerFindings } =
    await analyzeComponents(repoDir, options.includeFileFindings);

  // 5. Analyze non-JSX imports via TypeScript AST
  const { imports: importUsage, fileFindings: importFindings } =
    await analyzeImports(repoDir, options.includeFileFindings);

  // 6. Enrich package usage with import data from both analyzers
  enrichPackageUsage(designSystemPackages, componentUsage, importUsage);

  // Combine file findings from both sources
  const fileFindings = options.includeFileFindings
    ? [...reactScannerFindings, ...importFindings]
    : undefined;

  return {
    name: repoName,
    url: repoUrl,
    defaultBranch,
    lastCommitDate,
    repoMetadata: enrichedMetadata,
    workspaces,
    designSystemPackages,
    otherUILibraries,
    componentUsage,
    importUsage,
    fileFindings,
    cssOverrides,
  };
}

/**
 * Enrich PackageUsage entries with import data from react-scanner and import analyzer.
 *
 * Sets isImported, filesImportingCount, and symbolCountUsed on each package
 * based on which symbols from that package are actually used in source code.
 */
function enrichPackageUsage(
  packages: PackageUsage[],
  componentUsage: ComponentUsage[],
  importUsage: ImportUsage[],
): void {
  for (const pkg of packages) {
    // Collect data from react-scanner (JSX components)
    const components = componentUsage.filter(c => {
      // Match package root — componentUsage packageName may include deep import path
      const pkgRoot = c.packageName.split('/').slice(0, 2).join('/');
      return pkgRoot === pkg.name;
    });

    // Collect data from import analyzer (all imports)
    const imports = importUsage.filter(i => {
      const pkgRoot = i.packageName.split('/').slice(0, 2).join('/');
      return pkgRoot === pkg.name;
    });

    // Unique symbols from both sources
    const allSymbols = new Set<string>();
    const allFiles = new Set<string>();

    for (const c of components) {
      allSymbols.add(c.componentName);
      for (const f of c.files) {
        allFiles.add(f);
      }
    }
    for (const i of imports) {
      allSymbols.add(i.symbolName);
      // Import analyzer tracks filesUsedIn as a count, not individual files
    }

    // Count files from import analyzer separately (they track count, not names)
    const importFileCount = imports.reduce(
      (max, i) => Math.max(max, i.filesUsedIn),
      0,
    );

    pkg.isImported = components.length > 0 || imports.length > 0;
    pkg.filesImportingCount = Math.max(allFiles.size, importFileCount);
    pkg.symbolCountUsed = allSymbols.size;
  }
}

/**
 * Determine if a repository is likely a frontend project worth scanning.
 */
export function isFrontendRepo(packageJson: Record<string, unknown>): boolean {
  const deps = {
    ...(packageJson.dependencies as Record<string, string> | undefined),
    ...(packageJson.devDependencies as Record<string, string> | undefined),
  };

  const frontendIndicators = [
    'react',
    'react-dom',
    'next',
    'gatsby',
    'vue',
    'svelte',
    '@angular/core',
  ];

  return frontendIndicators.some(dep => dep in deps);
}
