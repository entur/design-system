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
  /** Unique code owners from CODEOWNERS file (e.g. ["@entur/team-x"]) */
  codeOwners: string[];
  /**
   * Owning teams (e.g. ["@entur/team-x"]), from the org team map when available
   * and CODEOWNERS otherwise. CODEOWNERS alone covers only about a quarter of repos.
   */
  ownerTeams: string[];
  /** Where ownerTeams came from */
  ownerTeamsSource: 'org-team' | 'codeowners' | 'none';
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
  /** CSS override findings (.eds-* selectors used in consumer code) */
  cssOverrides: CssOverrideFinding[];
  /** Colour token usage, aggregated per token */
  colorTokenUsage: ColorTokenFinding[];
  /** Hardcoded colour literals, aggregated per normalised value */
  hardcodedColors: HardcodedColorFinding[];
  /** Repo-level typography rollup */
  typographySummary: TypographySummary;
  /** Repo-level colour token rollup */
  colorTokenSummary: ColorTokenSummary;
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
  /** Subpath beyond package root if deep import (e.g., "/beta") */
  deepImportPath?: string;
}

// ── CSS override types ──

/** Which generation of a package's internal class names an override targets. */
export type ClassGeneration = 'legacy' | 'beta' | 'unknown';

/** Where an override of an internal class name was found. */
export type OverrideSource = 'stylesheet' | 'css-in-js' | 'jsx-classname';

/** A single CSS override finding (.eds-* selector used in consumer code). */
export interface CssOverrideFinding {
  /** The .eds-* CSS class selector being overridden (e.g. ".eds-primary-button") */
  selector: string;
  /** File path relative to repo root */
  filePath: string;
  /** Line number where the selector appears */
  lineNumber: number;
  /** File extension (e.g. ".scss") */
  fileExtension: string;
  /** Package that owns the class, or null when unrecognised */
  packageName: string | null;
  /** Class without its modifier suffix (".eds-text--paragraph" → "eds-text") */
  baseClass: string | null;
  /** Which generation of the package's styles the class belongs to */
  classGeneration: ClassGeneration;
  /** Whether this came from a stylesheet, a CSS-in-JS literal, or a className string */
  source: OverrideSource;
}

// ── Colour token types ──

/** The token layer a colour variable belongs to. */
export type ColorTokenLayer =
  | 'primitive'
  | 'semantic'
  | 'base'
  | 'data'
  | 'transport'
  | 'component'
  | 'legacy';

/** How a colour token reference was written. */
export type ColorSource =
  | 'stylesheet'
  | 'css-in-js'
  | 'js-token-object'
  | 'inline-style';

/** Aggregated usage of one colour token in one repository. */
export interface ColorTokenFinding {
  /** Token name without sigil (e.g. "blue-10", "colors-blues-blue50") */
  tokenName: string;
  /** Which token layer the token belongs to */
  tokenLayer: ColorTokenLayer;
  /** Legacy (hand-maintained) tokens vs the Figma-variable generation */
  tokenGeneration: 'legacy' | 'new';
  /** Total references across the repo */
  occurrenceCount: number;
  /** Number of distinct files referencing it */
  fileCount: number;
  /** Distinct sources the references came from */
  sources: ColorSource[];
}

/** How a hardcoded colour literal was written. */
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'named';

/** Aggregated usage of one hardcoded colour literal in one repository. */
export interface HardcodedColorFinding {
  /** Normalised value — lowercase hex where convertible, else the literal trimmed and lowercased */
  value: string;
  /** Notation the literal was written in */
  colorFormat: ColorFormat;
  /** Total occurrences across the repo */
  occurrenceCount: number;
  /** Number of distinct files it appears in */
  fileCount: number;
  /**
   * Name of a design system token with the same value, when one exists.
   * The core migration-friction signal: a colour hardcoded despite having a token.
   */
  matchesTokenName?: string;
  /** Layer of the matching token */
  matchesTokenLayer?: ColorTokenLayer;
  /** Distinct sources the occurrences came from */
  sources: ColorSource[];
}

// ── Repo-level rollups ──

/**
 * Per-repo typography summary, so adoption is a single-event metric rather than
 * something that has to be recomputed by joining component rows.
 */
export interface TypographySummary {
  /** Whether @entur/typography is a dependency */
  hasPackage: boolean;
  /** Declared version range, or null */
  packageVersion: string | null;
  /** Whether it is only a devDependency (i.e. not shipped to production) */
  isDevDependency: boolean;
  /** Any JSX usage of a component only the new typography exports */
  usesNewTypography: boolean;
  /** Any JSX usage of a component only the legacy typography exports */
  usesLegacyTypography: boolean;
  /** JSX instances of new typography components (Heading, Text) */
  newInstanceCount: number;
  /** JSX instances of legacy typography components (Heading1-6, Paragraph, ...) */
  legacyInstanceCount: number;
  /**
   * JSX instances of components both generations export under the same name
   * (Link, Blockquote, BlockquoteFooter, the lists). Excluded from newShare,
   * since the name cannot tell the generations apart once the new typography
   * is promoted out of beta.
   */
  sharedInstanceCount: number;
  /** newInstanceCount / (new + legacy), or null when there are no instances */
  newShare: number | null;
  /** Overrides of typography class names, any generation */
  classOverrideCount: number;
  /** Overrides targeting legacy typography class names */
  classOverrideLegacyCount: number;
  /** Overrides targeting beta typography class names */
  classOverrideBetaCount: number;
  /**
   * Overrides of a class name both generations ship, so the generation cannot
   * be told apart (.eds-contrast today). Kept as its own count so the three
   * add up to classOverrideCount instead of leaving an unexplained remainder.
   */
  classOverrideUnknownCount: number;
}

/** Per-repo colour token summary. */
export interface ColorTokenSummary {
  /** Whether the colour analysis ran to completion for this repo */
  analysisComplete: boolean;
  /** Number of stylesheet files inspected */
  styleFilesScanned: number;
  /** Total colour token references */
  usageCount: number;
  /** Number of distinct tokens referenced */
  distinctTokenCount: number;
  /** References to legacy (hand-maintained) tokens */
  legacyTokenCount: number;
  /** References to the Figma-variable token generation */
  newTokenCount: number;
  /** Total hardcoded colour occurrences */
  hardcodedColorCount: number;
  /** Hardcoded occurrences whose value already exists as a token */
  hardcodedMatchingTokenCount: number;
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

/** An internal CSS class name published by a design system package. */
export interface CatalogClassName {
  /** Class name without the leading dot (e.g. "eds-text--paragraph") */
  className: string;
  /** Class without its modifier suffix (e.g. "eds-text") */
  baseClass: string;
  /** Package that publishes it */
  packageName: string;
  /** Which generation of the package's styles it belongs to */
  generation: ClassGeneration;
}

/** A colour token published by the design system. */
export interface CatalogColorToken {
  /** Token name without sigil (e.g. "blue-10", "colors-blues-blue50") */
  name: string;
  /** Which token layer it belongs to */
  layer: ColorTokenLayer;
  /** Normalised lowercase hex value, or null when it resolves to another variable */
  value: string | null;
}

/**
 * Class names and colour tokens published by the design system, built from the
 * monorepo's own sources. Kept separate from DesignSystemCatalog because it needs
 * neither the TypeScript type checker nor network access.
 */
export interface StyleCatalog {
  classNames: CatalogClassName[];
  colorTokens: CatalogColorToken[];
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
