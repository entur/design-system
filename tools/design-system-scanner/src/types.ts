// ── Scan run metadata ──

/** Metadata about the scan execution itself. */
export interface ScanRunMetadata {
  /** Unique scan identifier */
  scanId: string;
  /** ISO timestamp when the scan ran */
  scanTimestamp: string;
  /** Scanner tool version (from package.json) */
  scannerVersion: string;
  /** Total repos found during discovery */
  totalReposDiscovered: number;
  /** Repos that were actually scanned */
  totalReposScanned: number;
  /** Repos where scanning failed */
  totalReposFailed: number;
  /** Overall scan outcome */
  scanStatus: 'success' | 'partial' | 'failure';
}

// ── Repository-level types ──

/** Enriched repository metadata from GitHub API + detection heuristics. */
export interface RepoMetadata {
  /** Repository visibility */
  visibility: 'public' | 'private' | 'internal';
  /** Whether the repo is archived */
  archived: boolean;
  /** Primary language as reported by GitHub */
  primaryLanguage: string | null;
  /** When the repo was created on GitHub */
  createdAt: string;
  /** Last push timestamp */
  pushedAt: string;
  /** Whether multiple package.json files were found (monorepo heuristic) */
  isMonorepo: boolean;
  /** Detected framework (next, gatsby, remix, cra, vite) */
  framework: string | null;
  /** Resolved React version from lockfile, or declared range if unresolvable (e.g. "18.3.1") */
  reactVersion: string | null;
}

/** Information about a workspace/package inside a monorepo. */
export interface WorkspaceInfo {
  /** Workspace name from its package.json */
  name: string;
  /** Relative path from repo root (e.g., "apps/web") */
  path: string;
  /** Heuristic type based on path convention */
  type: 'app' | 'package' | 'unknown';
  /** Detected framework in this workspace */
  framework: string | null;
  /** Number of @entur/* packages in this workspace */
  dsPackageCount: number;
}

/** Result of scanning a single repository for design system usage. */
export interface RepositoryUsage {
  /** Repository name (e.g., "entur/my-app") */
  name: string;
  /** Repository URL */
  url: string;
  /** Default branch name */
  defaultBranch: string;
  /** ISO timestamp of the last commit to the default branch */
  lastCommitDate: string;
  /** Enriched repo metadata from GitHub API + detection */
  repoMetadata?: RepoMetadata;
  /** Detected workspaces (monorepo sub-packages) */
  workspaces: WorkspaceInfo[];
  /** Detected @entur/* design system packages */
  designSystemPackages: PackageUsage[];
  /** Other major UI libraries detected */
  otherUILibraries: LibraryUsage[];
  /** Design system component usage in source code (via react-scanner AST analysis) */
  componentUsage: ComponentUsage[];
  /** Non-JSX import usage (hooks, utils, tokens — via TS AST analysis) */
  importUsage: ImportUsage[];
  /** Per-file findings for drilldown (only when --include-file-findings is set) */
  fileFindings?: FileFinding[];
  /** CSS override findings (.eds-* selectors used in consumer stylesheets) */
  cssOverrides: CssOverrideFinding[];
}

// ── Package-level types ──

/** Information about a design system package dependency. */
export interface PackageUsage {
  /** Package name (e.g., "@entur/button") */
  name: string;
  /** Version range from package.json (e.g., "^4.0.3") */
  version: string;
  /** Resolved version from lockfile (e.g., "4.0.5") */
  resolvedVersion?: string;
  /** Whether this is a devDependency */
  isDev: boolean;
  /** Whether any symbol from this package is imported in source code */
  isImported: boolean;
  /** Number of files that import from this package */
  filesImportingCount: number;
  /** Number of distinct symbols imported from this package */
  symbolCountUsed: number;
}

/** Information about a non-design-system UI library. */
export interface LibraryUsage {
  /** Package name (e.g., "@mui/material") */
  name: string;
  /** Version range from package.json */
  version: string;
  /** Category classification (e.g., "UI Framework", "CSS-in-JS") */
  category: string;
}

// ── Symbol-level types ──

export type ImportStyle = 'named' | 'default' | 'namespace' | 'unknown';
export type SymbolType = 'component' | 'hook' | 'util' | 'token' | 'unknown';

/** Aggregated usage of a single design system component (from react-scanner). */
export interface ComponentUsage {
  /** Package that exports this component (e.g., "@entur/button") */
  packageName: string;
  /** Component name (e.g., "PrimaryButton") */
  componentName: string;
  /** Number of JSX instances (actual renders, not just imports) */
  instanceCount: number;
  /** Prop name → usage count across all instances */
  props: Record<string, number>;
  /** Number of instances using spread props ({...props}) */
  propsSpreadCount: number;
  /** Filenames (not full paths) where this component is used */
  files: string[];
  /** How this component is imported */
  importStyle: ImportStyle;
  /** Whether the import is aliased (e.g., import { Button as Btn }) */
  isAliased: boolean;
  /** The alias name if isAliased is true */
  aliasName?: string;
  /** Subpath beyond package root if deep import (e.g., "/beta") */
  deepImportPath?: string;
}

/** Aggregated non-JSX import usage (hooks, utils, tokens — from TS AST analysis). */
export interface ImportUsage {
  /** Package that exports this symbol (e.g., "@entur/tokens") */
  packageName: string;
  /** Imported symbol name (e.g., "colors", "useContrast") */
  symbolName: string;
  /** Classified type of the symbol */
  symbolType: SymbolType;
  /** How this symbol is imported */
  importStyle: ImportStyle;
  /** Whether the import is aliased */
  isAliased: boolean;
  /** The alias name if isAliased is true */
  aliasName?: string;
  /** Number of references to this symbol across all files */
  referenceCount: number;
  /** Number of files that import this symbol */
  filesUsedIn: number;
}

// ── CSS override types ──

/** A single CSS override finding (.eds-* selector used in consumer stylesheets). */
export interface CssOverrideFinding {
  /** The .eds-* CSS class selector being overridden (e.g. ".eds-primary-button") */
  selector: string;
  /** File path relative to repo root */
  filePath: string;
  /** Line number where the selector appears */
  lineNumber: number;
  /** File extension (e.g. ".scss") */
  fileExtension: string;
}

// ── File-level types ──

/** A single file-level finding for drilldown analysis. */
export interface FileFinding {
  /** File path relative to repo root */
  filePath: string;
  /** File extension (e.g., ".tsx") */
  fileExtension: string;
  /** Package this finding relates to */
  packageName: string;
  /** Symbol name (nullable for package-level findings) */
  symbolName?: string;
  /** What kind of finding */
  findingType: 'import' | 'jsx_usage' | 'deep_import';
  /** Line number in the file */
  lineNumber?: number;
  /** Whether this file is a test file */
  isTestFile: boolean;
  /** Whether this file is a storybook story */
  isStorybookFile: boolean;
  /** Whether this file appears to be generated */
  isGeneratedFile: boolean;
}

// ── Catalog types ──

/** A known symbol from the design system catalog. */
export interface CatalogSymbol {
  symbolName: string;
  symbolType: SymbolType;
  /** Self-declared prop names (excludes inherited HTML/React props). */
  knownProps: string[];
}

/** A package entry in the design system catalog. */
export interface CatalogPackage {
  packageName: string;
  /** Latest published version on npm, or null if unavailable. */
  latestVersion: string | null;
  symbols: CatalogSymbol[];
}

/** The full design system component/symbol catalog. */
export interface DesignSystemCatalog {
  packages: CatalogPackage[];
}

// ── Report types ──

/** Full scan report. */
export interface ScanReport {
  /** ISO timestamp when the scan was run */
  timestamp: string;
  /** Source of the scan (e.g., "github-actions") */
  source: string;
  /** Scan run metadata */
  scanRun?: ScanRunMetadata;
  /** Number of repos scanned */
  totalReposScanned: number;
  /** Number of repos with design system usage */
  reposWithUsage: number;
  /** Per-repository usage data */
  repositories: RepositoryUsage[];
  /** Known limitations of the scan */
  limitations: string[];
}
