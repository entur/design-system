import * as path from 'path';
import {
  analyzePackageJson,
  detectFramework,
  detectReactVersion,
  detectWorkspaces,
} from './analyzers/packageAnalyzer';
import { analyzeComponents } from './analyzers/reactScannerAnalyzer';
import { analyzeImports } from './analyzers/importAnalyzer';
import { resolveVersions } from './analyzers/lockfileResolver';
import { analyzeCssOverrides } from './analyzers/cssOverrideAnalyzer';
import { analyzeColorTokens } from './analyzers/colorTokenAnalyzer';
import { analyzeCodeOwners } from './analyzers/codeOwnersAnalyzer';
import { loadStyleCatalog } from './analyzers/styleCatalog';
import type { StyleCatalogIndex } from './analyzers/styleCatalog';
import { buildColorTokenSummary, buildTypographySummary } from './rollups';
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
  /**
   * Override where the design system's own packages/ directory is found. Used
   * to build the class name and colour token catalogue; resolved from the
   * scanner's own location when omitted.
   */
  packagesRoot?: string;
  /**
   * Owning teams for this repo, from the org team map. Falls back to the
   * CODEOWNERS teams when empty, which covers far fewer repos.
   */
  ownerTeams?: string[];
  /** Pre-built style catalogue, to avoid rebuilding it per repo */
  styleCatalog?: StyleCatalogIndex | null;
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
 * 6. Internal .eds-* class name usage in stylesheets, CSS-in-JS and className
 * 7. Colour token usage and hardcoded colours
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

  // 2. Detect framework, workspaces, and React version
  const framework = detectFramework(repoDir);
  const workspaces = detectWorkspaces(repoDir);

  // Detect React version — root package.json first, then workspace package.jsons
  // (some monorepos only declare React in individual workspace packages, not at root)
  let reactVersionRange = detectReactVersion(repoDir);
  if (!reactVersionRange && workspaces.length > 0) {
    for (const ws of workspaces) {
      const wsVersion = detectReactVersion(path.join(repoDir, ws.path));
      if (wsVersion) {
        reactVersionRange = wsVersion;
        break;
      }
    }
  }

  // Analyze CODEOWNERS
  const codeOwners = analyzeCodeOwners(repoDir);

  // CODEOWNERS names a team in only about a quarter of Entur repos, so the org
  // team map is the primary source and CODEOWNERS the fallback.
  const providedTeams = options.ownerTeams?.filter(Boolean) ?? [];
  const ownerTeams = providedTeams.length > 0 ? providedTeams : codeOwners;
  const ownerTeamsSource: RepoMetadata['ownerTeamsSource'] =
    providedTeams.length > 0
      ? 'org-team'
      : codeOwners.length > 0
      ? 'codeowners'
      : 'none';

  // Enrich repo metadata — react version resolved from lockfile below (alongside DS packages)
  const enrichedMetadata: RepoMetadata | undefined = repoMetadata
    ? {
        ...repoMetadata,
        isMonorepo,
        framework: repoMetadata.framework || framework,
        reactVersion: repoMetadata.reactVersion ?? reactVersionRange,
        codeOwners,
        ownerTeams,
        ownerTeamsSource,
      }
    : undefined;

  // The catalogue of internal class names and colour tokens, built from the
  // design system's own sources. Callers scanning many repos should build it
  // once and pass it in.
  const styleCatalog =
    options.styleCatalog !== undefined
      ? options.styleCatalog
      : loadStyleCatalog(options.packagesRoot);

  // Class name usage and colour tokens are always scanned: a repo with no
  // @entur/* dependency can still hardcode colours the design system publishes,
  // and the colour mapping is meant to cover the estate, not just consumers.
  const { findings: cssOverrides, styleFilesScanned } = analyzeCssOverrides(
    repoDir,
    styleCatalog,
  );
  const { tokens: colorTokenUsage, hardcoded: hardcodedColors } =
    analyzeColorTokens(repoDir, styleCatalog);

  const colorTokenSummary = buildColorTokenSummary({
    analysisComplete: styleCatalog !== null,
    styleFilesScanned,
    colorTokenUsage,
    hardcodedColors,
  });

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
      colorTokenUsage,
      hardcodedColors,
      typographySummary: buildTypographySummary({
        designSystemPackages: [],
        componentUsage: [],
        cssOverrides,
      }),
      colorTokenSummary,
    };
  }

  // 3. Resolve actual installed versions from lockfile — batch React with DS packages (single parse)
  const reactPkg: PackageUsage | null = reactVersionRange
    ? {
        name: 'react',
        version: reactVersionRange,
        isDev: false,
        isImported: false,
        filesImportingCount: 0,
        symbolCountUsed: 0,
      }
    : null;
  resolveVersions(
    repoDir,
    reactPkg ? [...designSystemPackages, reactPkg] : designSystemPackages,
  );

  // Update enrichedMetadata with resolved React version (replaces the declared range)
  if (reactPkg?.resolvedVersion && enrichedMetadata) {
    enrichedMetadata.reactVersion = reactPkg.resolvedVersion;
  }

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
    colorTokenUsage,
    hardcodedColors,
    typographySummary: buildTypographySummary({
      designSystemPackages,
      componentUsage,
      cssOverrides,
    }),
    colorTokenSummary,
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
