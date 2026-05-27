#!/usr/bin/env node
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { scanRepository } from './scanner';
import type { PostHogLike } from './export/posthogClient';
import type {
  ScanReport,
  ScanRunMetadata,
  RepositoryUsage,
  RepoMetadata,
  ComponentUsage,
  ImportUsage,
  CssOverrideFinding,
  DesignSystemCatalog,
  CatalogSymbol,
} from './types';

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf-8'),
) as { version: string };
const SCANNER_VERSION = packageJson.version ?? 'unknown';

const SCAN_LIMITATIONS = [
  'Re-exports through barrel files are not followed — only direct @entur/* imports are detected.',
  'React.lazy() and other dynamic imports are not detected.',
  'Aliased imports (e.g., import { Button as Btn }) are tracked as separate component names.',
  'Only JSX renders are counted — programmatic usage (e.g., createElement) is not detected.',
  'Hook/util/token detection uses name-based heuristics and may misclassify some symbols.',
];

/**
 * CLI entry point for the design system usage scanner.
 *
 * Modes:
 *   scanner --local /path/to/repo [--repo-name ...] [--output result.json]
 *   scanner --aggregate /path/to/results --total-repos N --output report.json
 *   scanner --bigquery-export report.json [--output bq-dir/]
 *   scanner --posthog-export report.json [--posthog-dry-run] [--posthog-host <url>]
 */
async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printUsage();
    return;
  }

  if (args.local) {
    await scanLocal(args);
  } else if (args.aggregate) {
    await aggregateResults(args);
  } else if (args.bigqueryExport) {
    exportForBigQuery(args);
  } else if (args.posthogExport) {
    await exportToPostHog(args);
  } else {
    console.error(
      'Error: Specify --local <path>, --aggregate <path>, --bigquery-export <path>, or --posthog-export <path>',
    );
    printUsage();
    process.exit(1);
  }
}

async function scanLocal(args: ParsedArgs): Promise<void> {
  const resolvedDir = path.resolve(args.local!);

  if (!fs.existsSync(resolvedDir)) {
    console.error(`Directory not found: ${resolvedDir}`);
    process.exit(1);
  }

  const repoName = args.repoName || path.basename(resolvedDir);
  const repoUrl = args.repoUrl || `file://${resolvedDir}`;
  const defaultBranch = args.defaultBranch || 'local';
  const lastCommit = args.lastCommit || new Date().toISOString();

  // Build RepoMetadata from CLI flags (passed from workflow)
  const repoMetadata: RepoMetadata | undefined =
    args.visibility || args.archived !== undefined
      ? {
          visibility:
            (args.visibility as RepoMetadata['visibility']) || 'private',
          archived: args.archived === 'true',
          primaryLanguage: args.primaryLanguage || null,
          createdAt: args.createdAt || '',
          pushedAt: lastCommit,
          isMonorepo: false, // Will be detected by scanner
          framework: null, // Will be detected by scanner
          reactVersion: null, // Will be detected by scanner
          codeOwners: [], // Will be detected by scanner
        }
      : undefined;

  console.log(`Scanning: ${repoName} (${resolvedDir})`);

  const usage = await scanRepository(
    resolvedDir,
    repoName,
    repoUrl,
    defaultBranch,
    lastCommit,
    repoMetadata,
    { includeFileFindings: args.includeFileFindings },
  );

  if (args.output) {
    fs.writeFileSync(args.output, JSON.stringify(usage, null, 2));
    console.log(`Result written to ${args.output}`);
  } else {
    printSummary(usage);
  }
}

async function aggregateResults(args: ParsedArgs): Promise<void> {
  const resultsDir = path.resolve(args.aggregate!);

  if (!fs.existsSync(resultsDir)) {
    console.error(`Results directory not found: ${resultsDir}`);
    process.exit(1);
  }

  if (!args.output) {
    console.error('Error: --output is required for --aggregate mode');
    process.exit(1);
  }

  // Find all JSON files in the results directory (flat or nested from artifact download)
  const jsonFiles = findJsonFiles(resultsDir);
  console.log(`Found ${jsonFiles.length} scan result files in ${resultsDir}`);

  const repositories: RepositoryUsage[] = [];

  for (const file of jsonFiles) {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
      // Each file is a single RepositoryUsage object
      if (content.name && Array.isArray(content.designSystemPackages)) {
        repositories.push(content as RepositoryUsage);
      }
    } catch (error) {
      console.warn(
        `Skipping invalid file ${file}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  const totalRepos = args.totalRepos || repositories.length;
  const failedRepos = totalRepos - repositories.length;

  const scanRun: ScanRunMetadata = {
    scanId: crypto.randomUUID(),
    scanTimestamp: new Date().toISOString(),
    scannerVersion: SCANNER_VERSION,
    totalReposDiscovered: totalRepos,
    totalReposScanned: repositories.length,
    totalReposFailed: failedRepos,
    scanStatus:
      failedRepos === 0
        ? 'success'
        : repositories.length === 0
        ? 'failure'
        : 'partial',
  };

  const report: ScanReport = {
    timestamp: scanRun.scanTimestamp,
    source: 'github-actions',
    scanRun,
    totalReposScanned: repositories.length,
    reposWithUsage: repositories.filter(
      r => r.designSystemPackages.length > 0 || r.otherUILibraries.length > 0,
    ).length,
    repositories,
    limitations: SCAN_LIMITATIONS,
  };

  fs.writeFileSync(args.output, JSON.stringify(report, null, 2));
  console.log(
    `Aggregated ${repositories.length} repos into ${args.output}` +
      ` (${report.reposWithUsage} with usage out of ${totalRepos} total)`,
  );
}

/**
 * Export a scan report as NDJSON files suitable for BigQuery loading.
 *
 * Produces up to 6 files:
 *   - scan_runs.ndjson: one row per scan execution
 *   - repos.ndjson: one row per repo per scan
 *   - repo_package_usage.ndjson: one row per (repo, package)
 *   - repo_symbol_usage.ndjson: one row per (repo, symbol) — merged from react-scanner + import analyzer
 *   - repo_workspaces.ndjson: one row per (repo, workspace)
 *   - file_findings.ndjson: one row per file-level finding (only with --include-file-findings)
 */
function exportForBigQuery(args: ParsedArgs): void {
  const reportPath = path.resolve(args.bigqueryExport!);

  if (!fs.existsSync(reportPath)) {
    console.error(`Report file not found: ${reportPath}`);
    process.exit(1);
  }

  const outputDir = args.output
    ? path.resolve(args.output)
    : path.dirname(reportPath);

  const report: ScanReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  // Load catalog if provided
  let catalog: DesignSystemCatalog | null = null;
  if (args.catalog) {
    const catalogPath = path.resolve(args.catalog);
    if (!fs.existsSync(catalogPath)) {
      console.warn(
        `Catalog file not found: ${catalogPath} — skipping catalog export`,
      );
    } else {
      catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    }
  }

  const scanId = report.scanRun?.scanId || crypto.randomUUID();
  const scanTimestamp = report.timestamp;

  // ── scan_runs: one row per scan ──
  const scanRunRow = JSON.stringify({
    scan_id: scanId,
    scan_timestamp: scanTimestamp,
    scanner_version: report.scanRun?.scannerVersion || SCANNER_VERSION,
    source: report.source,
    total_repos_discovered:
      report.scanRun?.totalReposDiscovered || report.totalReposScanned,
    total_repos_scanned:
      report.scanRun?.totalReposScanned || report.totalReposScanned,
    total_repos_failed: report.scanRun?.totalReposFailed || 0,
    scan_status: report.scanRun?.scanStatus || 'success',
  });

  // ── Per-repo rows ──
  const repoRows: string[] = [];
  const packageRows: string[] = [];
  const symbolRows: string[] = [];
  const workspaceRows: string[] = [];
  const fileFindingRows: string[] = [];
  const cssOverrideRows: string[] = [];
  const catalogRows: string[] = [];

  for (const repo of report.repositories) {
    // repos table
    repoRows.push(
      JSON.stringify({
        scan_id: scanId,
        scan_timestamp: scanTimestamp,
        repo_name: repo.name,
        repo_url: repo.url,
        default_branch: repo.defaultBranch,
        last_commit_date: repo.lastCommitDate,
        visibility: repo.repoMetadata?.visibility || null,
        archived: repo.repoMetadata?.archived || false,
        primary_language: repo.repoMetadata?.primaryLanguage || null,
        created_at: repo.repoMetadata?.createdAt || null,
        pushed_at: repo.repoMetadata?.pushedAt || null,
        is_monorepo: repo.repoMetadata?.isMonorepo || false,
        framework: repo.repoMetadata?.framework || null,
        react_version: repo.repoMetadata?.reactVersion || null,
        code_owners: repo.repoMetadata?.codeOwners || [],
        ds_package_count: repo.designSystemPackages.length,
        ui_library_count: repo.otherUILibraries.length,
        component_count: repo.componentUsage.length,
        css_override_count: repo.cssOverrides?.length || 0,
      }),
    );

    // repo_package_usage table — design system packages
    for (const pkg of repo.designSystemPackages) {
      packageRows.push(
        JSON.stringify({
          scan_id: scanId,
          scan_timestamp: scanTimestamp,
          repo_name: repo.name,
          package_name: pkg.name,
          package_version: pkg.version,
          resolved_version: pkg.resolvedVersion || null,
          is_dev: pkg.isDev,
          is_design_system: true,
          is_imported: pkg.isImported,
          files_importing_count: pkg.filesImportingCount,
          symbol_count_used: pkg.symbolCountUsed,
        }),
      );
    }

    // repo_package_usage table — other UI libraries
    for (const lib of repo.otherUILibraries) {
      packageRows.push(
        JSON.stringify({
          scan_id: scanId,
          scan_timestamp: scanTimestamp,
          repo_name: repo.name,
          package_name: lib.name,
          package_version: lib.version,
          resolved_version: null,
          is_dev: false,
          is_design_system: false,
          is_imported: false,
          files_importing_count: 0,
          symbol_count_used: 0,
          ui_library_category: lib.category,
        }),
      );
    }

    // repo_symbol_usage table — merge react-scanner + import analyzer
    emitSymbolRows(
      symbolRows,
      scanId,
      scanTimestamp,
      repo.name,
      repo.componentUsage,
      repo.importUsage || [],
    );

    // repo_workspaces table
    for (const ws of repo.workspaces || []) {
      workspaceRows.push(
        JSON.stringify({
          scan_id: scanId,
          scan_timestamp: scanTimestamp,
          repo_name: repo.name,
          workspace_name: ws.name,
          workspace_path: ws.path,
          workspace_type: ws.type,
          workspace_framework: ws.framework,
          ds_package_count: ws.dsPackageCount,
        }),
      );
    }

    // file_findings table
    for (const finding of repo.fileFindings || []) {
      fileFindingRows.push(
        JSON.stringify({
          scan_id: scanId,
          scan_timestamp: scanTimestamp,
          repo_name: repo.name,
          file_path: finding.filePath,
          file_extension: finding.fileExtension,
          package_name: finding.packageName,
          symbol_name: finding.symbolName || null,
          finding_type: finding.findingType,
          line_number: finding.lineNumber || null,
          is_test_file: finding.isTestFile,
          is_storybook_file: finding.isStorybookFile,
          is_generated_file: finding.isGeneratedFile,
        }),
      );
    }

    // repo_css_overrides table
    emitCssOverrideRows(
      cssOverrideRows,
      scanId,
      scanTimestamp,
      repo.name,
      repo.cssOverrides || [],
    );

    // Zero-count catalog rows for installed-but-unused symbols
    if (catalog) {
      emitCatalogZeroRows(
        symbolRows,
        scanId,
        scanTimestamp,
        repo.name,
        repo,
        catalog,
      );
    }
  }

  // ds_catalog table — one row per symbol in the catalog (global, not per-repo)
  if (catalog) {
    emitCatalogRows(catalogRows, scanId, scanTimestamp, catalog);
  }

  // Write NDJSON files
  const files: [string, string[]][] = [
    ['scan_runs.ndjson', [scanRunRow]],
    ['repos.ndjson', repoRows],
    ['repo_package_usage.ndjson', packageRows],
    ['repo_symbol_usage.ndjson', symbolRows],
    ['repo_workspaces.ndjson', workspaceRows],
  ];

  if (cssOverrideRows.length > 0) {
    files.push(['repo_css_overrides.ndjson', cssOverrideRows]);
  }

  if (catalogRows.length > 0) {
    files.push(['ds_catalog.ndjson', catalogRows]);
  }

  if (fileFindingRows.length > 0) {
    files.push(['file_findings.ndjson', fileFindingRows]);
  }

  for (const [filename, rows] of files) {
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, rows.join('\n') + '\n');
    console.log(`BigQuery export: ${rows.length} rows → ${filePath}`);
  }
}

/**
 * Merge react-scanner component data with import analyzer data into symbol rows.
 *
 * For symbols found by both: emit one merged row.
 * For symbols found by only one: emit with the available data.
 */
function emitSymbolRows(
  rows: string[],
  scanId: string,
  scanTimestamp: string,
  repoName: string,
  componentUsage: ComponentUsage[],
  importUsage: ImportUsage[],
): void {
  // Build a map of import analyzer results by (packageRoot, symbolName)
  const importMap = new Map<string, ImportUsage>();
  for (const imp of importUsage) {
    const pkgRoot = imp.packageName.split('/').slice(0, 2).join('/');
    importMap.set(`${pkgRoot}::${imp.symbolName}`, imp);
  }

  // Track which import entries have been merged with react-scanner data
  const mergedKeys = new Set<string>();

  // Emit react-scanner component rows (with optional import data merge)
  for (const comp of componentUsage) {
    const pkgRoot = comp.packageName.split('/').slice(0, 2).join('/');
    const key = `${pkgRoot}::${comp.componentName}`;
    const imp = importMap.get(key);

    if (imp) mergedKeys.add(key);

    rows.push(
      JSON.stringify({
        scan_id: scanId,
        scan_timestamp: scanTimestamp,
        repo_name: repoName,
        package_name: comp.packageName,
        symbol_name: comp.componentName,
        symbol_type: imp?.symbolType || 'component',
        instance_count: comp.instanceCount,
        reference_count: imp?.referenceCount || null,
        import_style: comp.importStyle,
        is_aliased: comp.isAliased,
        alias_name: comp.aliasName || null,
        deep_import_path: comp.deepImportPath || null,
        props_spread_count: comp.propsSpreadCount,
        file_count: comp.files.length,
        files_used_in: imp?.filesUsedIn || comp.files.length,
        props: Object.entries(comp.props)
          .sort(([, a], [, b]) => b - a)
          .map(([name, count]) => ({ name, count })),
        finding_source: imp ? 'both' : 'react-scanner',
      }),
    );
  }

  // Emit import-only rows (not already merged)
  for (const imp of importUsage) {
    const pkgRoot = imp.packageName.split('/').slice(0, 2).join('/');
    const key = `${pkgRoot}::${imp.symbolName}`;
    if (mergedKeys.has(key)) continue;

    rows.push(
      JSON.stringify({
        scan_id: scanId,
        scan_timestamp: scanTimestamp,
        repo_name: repoName,
        package_name: imp.packageName,
        symbol_name: imp.symbolName,
        symbol_type: imp.symbolType,
        instance_count: 0,
        reference_count: imp.referenceCount,
        import_style: imp.importStyle,
        is_aliased: imp.isAliased,
        alias_name: imp.aliasName || null,
        deep_import_path: null,
        props_spread_count: 0,
        file_count: imp.filesUsedIn,
        files_used_in: imp.filesUsedIn,
        props: [],
        finding_source: 'import-analyzer',
      }),
    );
  }
}

/**
 * Emit repo_css_overrides rows for a single repository.
 */
function emitCssOverrideRows(
  rows: string[],
  scanId: string,
  scanTimestamp: string,
  repoName: string,
  cssOverrides: CssOverrideFinding[],
): void {
  for (const override of cssOverrides) {
    rows.push(
      JSON.stringify({
        scan_id: scanId,
        scan_timestamp: scanTimestamp,
        repo_name: repoName,
        selector: override.selector,
        file_path: override.filePath,
        line_number: override.lineNumber,
        file_extension: override.fileExtension,
      }),
    );
  }
}

/**
 * Emit ds_catalog rows — one row per symbol across all packages.
 */
function emitCatalogRows(
  rows: string[],
  scanId: string,
  scanTimestamp: string,
  catalog: DesignSystemCatalog,
): void {
  for (const pkg of catalog.packages) {
    for (const symbol of pkg.symbols) {
      rows.push(
        JSON.stringify({
          scan_id: scanId,
          scan_timestamp: scanTimestamp,
          package_name: pkg.packageName,
          package_latest_version: pkg.latestVersion ?? null,
          symbol_name: symbol.symbolName,
          symbol_type: symbol.symbolType,
          known_props: symbol.knownProps,
        }),
      );
    }
  }
}

/**
 * Emit zero-count repo_symbol_usage rows for catalog symbols that are in an
 * installed package but were never observed in the repo's scan.
 *
 * Only emits for packages the repo actually has installed — a repo that never
 * installed @entur/button can't be "not using" PrimaryButton in any meaningful sense.
 */
function emitCatalogZeroRows(
  rows: string[],
  scanId: string,
  scanTimestamp: string,
  repoName: string,
  repo: RepositoryUsage,
  catalog: DesignSystemCatalog,
): void {
  // Build a set of already-emitted (packageName, symbolName) pairs for this repo
  const observed = new Set<string>();
  for (const comp of repo.componentUsage) {
    const pkgRoot = comp.packageName.split('/').slice(0, 2).join('/');
    observed.add(`${pkgRoot}::${comp.componentName}`);
  }
  for (const imp of repo.importUsage || []) {
    const pkgRoot = imp.packageName.split('/').slice(0, 2).join('/');
    observed.add(`${pkgRoot}::${imp.symbolName}`);
  }

  // Installed @entur/* package names
  const installedPackages = new Set(repo.designSystemPackages.map(p => p.name));

  for (const catalogPkg of catalog.packages) {
    if (!installedPackages.has(catalogPkg.packageName)) continue;

    for (const symbol of catalogPkg.symbols) {
      const key = `${catalogPkg.packageName}::${symbol.symbolName}`;
      if (observed.has(key)) continue;

      rows.push(
        JSON.stringify({
          scan_id: scanId,
          scan_timestamp: scanTimestamp,
          repo_name: repoName,
          package_name: catalogPkg.packageName,
          symbol_name: symbol.symbolName,
          symbol_type: symbol.symbolType,
          instance_count: 0,
          reference_count: 0,
          import_style: null,
          is_aliased: false,
          alias_name: null,
          deep_import_path: null,
          props_spread_count: 0,
          file_count: 0,
          files_used_in: 0,
          props: [],
          finding_source: 'catalog-zero',
        }),
      );
    }
  }
}

async function exportToPostHog(args: ParsedArgs): Promise<void> {
  const reportPath = path.resolve(args.posthogExport!);

  if (!fs.existsSync(reportPath)) {
    console.error(`Report file not found: ${reportPath}`);
    process.exit(1);
  }

  const report: ScanReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  const { sendScanReport, createDryRunClient, DEFAULT_POSTHOG_HOST } =
    await import('./export/posthogClient.js');

  const host =
    args.posthogHost ?? process.env.POSTHOG_HOST ?? DEFAULT_POSTHOG_HOST;

  if (args.posthogDryRun) {
    console.log('PostHog dry-run — events will be printed, not sent.\n');
    const client = createDryRunClient();
    const count = await sendScanReport(report, {
      client,
      scannerVersion: SCANNER_VERSION,
    });
    console.log(
      `\nDry-run complete. Would have sent ${count} events to ${host}`,
    );
    return;
  }

  const apiKey = args.posthogApiKey ?? process.env.POSTHOG_API_KEY;
  if (!apiKey) {
    console.error(
      'Error: POSTHOG_API_KEY is required. Set the env var or pass --posthog-key <key>',
    );
    process.exit(1);
  }

  const { PostHog } = await import('posthog-node');
  const client = new PostHog(apiKey, {
    host,
    // Raise limits to handle large scans (85+ repos → thousands of events).
    // Defaults (flushAt=20, maxQueueSize=1000) cause silent drops.
    flushAt: 200,
    maxQueueSize: 10000,
    maxBatchSize: 500,
  });

  const count = await sendScanReport(report, {
    client: client as unknown as PostHogLike,
    scannerVersion: SCANNER_VERSION,
  });

  // Give PostHog 60s to flush remaining events (default is 30s)
  await client.shutdown(60_000);
  console.log(`Sent ${count} events to PostHog at ${host}`);
}

function findJsonFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findJsonFiles(fullPath));
      } else if (entry.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  } catch {
    // Skip inaccessible directories
  }
  return files;
}

function printSummary(usage: RepositoryUsage): void {
  console.log('\n=== Design System Usage Report ===\n');

  if (usage.repoMetadata) {
    const m = usage.repoMetadata;
    const meta = [
      m.framework && `Framework: ${m.framework}`,
      m.isMonorepo && 'Monorepo',
      m.visibility,
      m.codeOwners.length > 0 && `Owners: ${m.codeOwners.join(', ')}`,
    ].filter(Boolean);
    if (meta.length > 0) console.log(`  ${meta.join(' | ')}\n`);
  }

  console.log(`@entur/* packages: ${usage.designSystemPackages.length}`);
  for (const pkg of usage.designSystemPackages) {
    const version = pkg.resolvedVersion
      ? `${pkg.version} → ${pkg.resolvedVersion}`
      : pkg.version;
    const imported = pkg.isImported
      ? ` (${pkg.symbolCountUsed} symbols in ${pkg.filesImportingCount} files)`
      : ' (declared only)';
    console.log(
      `  ${pkg.name}@${version}${pkg.isDev ? ' (dev)' : ''}${imported}`,
    );
  }

  console.log(`\nOther UI libraries: ${usage.otherUILibraries.length}`);
  for (const lib of usage.otherUILibraries) {
    console.log(`  ${lib.name}@${lib.version} [${lib.category}]`);
  }

  if (usage.workspaces.length > 0) {
    console.log(`\nWorkspaces: ${usage.workspaces.length}`);
    for (const ws of usage.workspaces) {
      console.log(
        `  ${ws.name} (${ws.path}) [${ws.type}] — ${ws.dsPackageCount} DS packages`,
      );
    }
  }

  console.log(
    `\nComponent usage (react-scanner): ${usage.componentUsage.length} components`,
  );
  for (const comp of usage.componentUsage.slice(0, 20)) {
    const alias = comp.isAliased ? ` (aliased as ${comp.aliasName})` : '';
    const deep = comp.deepImportPath ? ` [deep: ${comp.deepImportPath}]` : '';
    console.log(
      `  ${comp.componentName} (${comp.packageName}): ${comp.instanceCount} instances${alias}${deep}`,
    );
    if (comp.propsSpreadCount > 0) {
      console.log(`    ${comp.propsSpreadCount} instances use spread props`);
    }
    const topProps = Object.entries(comp.props)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    if (topProps.length > 0) {
      console.log(
        `    Props: ${topProps.map(([k, v]) => `${k}(${v})`).join(', ')}`,
      );
    }
  }

  if (usage.importUsage.length > 0) {
    console.log(
      `\nNon-JSX imports (TS AST): ${usage.importUsage.length} symbols`,
    );
    for (const imp of usage.importUsage.slice(0, 20)) {
      const alias = imp.isAliased ? ` (aliased as ${imp.aliasName})` : '';
      console.log(
        `  ${imp.symbolName} [${imp.symbolType}] (${imp.packageName}): ${imp.referenceCount} refs in ${imp.filesUsedIn} files${alias}`,
      );
    }
  }
}

interface ParsedArgs {
  local?: string;
  aggregate?: string;
  bigqueryExport?: string;
  repoName?: string;
  repoUrl?: string;
  defaultBranch?: string;
  lastCommit?: string;
  totalRepos?: number;
  output?: string;
  help?: boolean;
  // Repo metadata flags
  visibility?: string;
  archived?: string;
  primaryLanguage?: string;
  createdAt?: string;
  // Feature flags
  includeFileFindings?: boolean;
  catalog?: string;
  // PostHog export flags
  posthogExport?: string;
  posthogDryRun?: boolean;
  posthogHost?: string;
  posthogApiKey?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {};

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--local':
      case '-l':
        args.local = argv[++i];
        break;
      case '--aggregate':
        args.aggregate = argv[++i];
        break;
      case '--bigquery-export':
        args.bigqueryExport = argv[++i];
        break;
      case '--repo-name':
        args.repoName = argv[++i];
        break;
      case '--repo-url':
        args.repoUrl = argv[++i];
        break;
      case '--default-branch':
        args.defaultBranch = argv[++i];
        break;
      case '--last-commit':
        args.lastCommit = argv[++i];
        break;
      case '--total-repos':
        args.totalRepos = parseInt(argv[++i], 10) || undefined;
        break;
      case '--output':
        args.output = argv[++i];
        break;
      case '--visibility':
        args.visibility = argv[++i];
        break;
      case '--archived':
        args.archived = argv[++i];
        break;
      case '--primary-language':
        args.primaryLanguage = argv[++i];
        break;
      case '--created-at':
        args.createdAt = argv[++i];
        break;
      case '--include-file-findings':
        args.includeFileFindings = true;
        break;
      case '--catalog':
        args.catalog = argv[++i];
        break;
      case '--posthog-export':
        args.posthogExport = argv[++i];
        break;
      case '--posthog-dry-run':
        args.posthogDryRun = true;
        break;
      case '--posthog-host':
        args.posthogHost = argv[++i];
        break;
      case '--posthog-key':
        args.posthogApiKey = argv[++i];
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
    }
  }

  return args;
}

function printUsage(): void {
  console.log(`
Design System Usage Scanner (v${SCANNER_VERSION})

Scans repositories for @entur/* design system component and import usage.

Usage:
  scanner --local <path>                         Scan a local directory
  scanner --aggregate <path> --output <path>     Merge per-repo results
  scanner --bigquery-export <path> [--output <dir>]  Export report as NDJSON for BigQuery
  scanner --posthog-export <path>                Send scan report events to PostHog

Options:
  --local, -l <path>         Path to local repository to scan
  --repo-name <owner/repo>   Repository name (default: directory basename)
  --repo-url <url>           Repository URL
  --default-branch <branch>  Default branch name
  --last-commit <iso-date>   Last commit timestamp
  --aggregate <path>         Path to directory with per-repo JSON results
  --total-repos <n>          Total repos discovered (for report metadata)
  --bigquery-export <path>   Path to scan-report.json to export as NDJSON
  --catalog <path>           Path to catalog.json for unused symbol detection
  --posthog-export <path>    Path to scan-report.json to send to PostHog
  --posthog-dry-run          Print PostHog events without sending (no API key needed)
  --posthog-host <url>       PostHog host URL (default: https://eu.i.posthog.com)
  --posthog-key <key>        PostHog API key (default: POSTHOG_API_KEY env var)
  --output <path>            Write results to file or directory
  --visibility <vis>         Repository visibility (public/private/internal)
  --archived <bool>          Whether repo is archived
  --primary-language <lang>  Primary language from GitHub
  --created-at <iso-date>    Repo creation date
  --include-file-findings    Collect per-file findings for drilldown
  --help, -h                 Show this help message

Examples:
  # Scan a repo locally
  scanner --local /path/to/repo

  # Scan with metadata (used by CI)
  scanner --local ./target-repo --repo-name entur/abzu --output result.json

  # Aggregate CI results
  scanner --aggregate ./scan-results --total-repos 95 --output report.json

  # Export for BigQuery
  scanner --bigquery-export scan-report.json --output ./bq-export/

  # Send scan results to PostHog (dry-run)
  scanner --posthog-export scan-report.json --posthog-dry-run

  # Send scan results to PostHog
  POSTHOG_API_KEY=phc_xxx scanner --posthog-export scan-report.json
`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
