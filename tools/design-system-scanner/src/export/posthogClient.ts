/**
 * PostHog export client for the design system usage scanner.
 *
 * Provides a pure `buildScanEvents` function for testing, and a `sendScanReport`
 * function that drives a PostHog client (or test double) to emit events.
 *
 * Events emitted per scan:
 *   ds_scan_run         — one per scan execution
 *   ds_repo_scanned     — one per repository (stable distinctId for weekly timelines)
 *   ds_package_used     — one per (repo, @entur/* package)
 *   ds_component_used   — one per (repo, JSX component) from react-scanner
 *   ds_symbol_used      — one per (repo, non-JSX symbol) from import analyzer
 *   ds_css_override     — one per (repo, .eds-* CSS override)
 */

import type {
  ScanReport,
  RepositoryUsage,
  ComponentUsage,
  ImportUsage,
  CssOverrideFinding,
  PackageUsage,
} from '../types';

/** Minimal PostHog client interface — satisfied by posthog-node and the dry-run double. */
export interface PostHogLike {
  capture(payload: CapturePayload): void;
  groupIdentify(payload: GroupIdentifyPayload): void;
}

export interface CapturePayload {
  distinctId: string;
  event: string;
  properties: Record<string, unknown>;
}

export interface GroupIdentifyPayload {
  groupType: string;
  groupKey: string;
  properties: Record<string, unknown>;
}

const DEFAULT_POSTHOG_HOST = 'https://eu.i.posthog.com';

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Build all PostHog capture payloads for a scan report without sending them.
 * Useful for tests and dry-run validation.
 */
export function buildScanEvents(
  report: ScanReport,
  opts: { scannerVersion?: string } = {},
): CapturePayload[] {
  const scannerVersion = opts.scannerVersion ?? 'unknown';
  const events: CapturePayload[] = [];

  const scanId = report.scanRun?.scanId ?? 'scan-unknown';
  const ts = report.timestamp;

  // ds_scan_run — one per execution
  events.push({
    distinctId: `scan-run:${scanId}`,
    event: 'ds_scan_run',
    properties: {
      $timestamp: ts,
      scan_id: scanId,
      total_repos_scanned: report.totalReposScanned,
      repos_with_usage: report.reposWithUsage,
      scanner_version: scannerVersion,
      source: report.source,
      scan_status: report.scanRun?.scanStatus ?? 'success',
    },
  });

  for (const repo of report.repositories) {
    events.push(...buildRepoEvents(repo, ts));
  }

  return events;
}

/**
 * Build all group identify payloads for a scan report.
 * Deduplicates packages across repos.
 */
export function buildGroupIdentifies(
  report: ScanReport,
): GroupIdentifyPayload[] {
  const identifies: GroupIdentifyPayload[] = [];
  const seenPackages = new Set<string>();
  const seenComponents = new Set<string>();
  const seenSymbols = new Set<string>();

  for (const repo of report.repositories) {
    // Repo group
    identifies.push({
      groupType: 'repo',
      groupKey: repo.name,
      properties: {
        name: repo.name,
        url: repo.url,
        default_branch: repo.defaultBranch,
        last_commit_date: repo.lastCommitDate,
        visibility: repo.repoMetadata?.visibility ?? null,
        archived: repo.repoMetadata?.archived ?? false,
        framework: repo.repoMetadata?.framework ?? null,
        primary_language: repo.repoMetadata?.primaryLanguage ?? null,
        is_monorepo: repo.repoMetadata?.isMonorepo ?? false,
      },
    });

    // Package groups (deduplicated)
    for (const pkg of repo.designSystemPackages) {
      if (!seenPackages.has(pkg.name)) {
        seenPackages.add(pkg.name);
        identifies.push({
          groupType: 'ds_package',
          groupKey: pkg.name,
          properties: { name: pkg.name },
        });
      }
    }

    // Component groups (deduplicated across repos)
    for (const comp of repo.componentUsage) {
      const key = `${comp.packageName}::${comp.componentName}`;
      if (!seenComponents.has(key)) {
        seenComponents.add(key);
        identifies.push({
          groupType: 'ds_component',
          groupKey: key,
          properties: {
            package_name: comp.packageName,
            component_name: comp.componentName,
          },
        });
      }
    }

    // Symbol groups (deduplicated)
    for (const imp of repo.importUsage) {
      const key = `${imp.packageName}::${imp.symbolName}`;
      if (!seenSymbols.has(key)) {
        seenSymbols.add(key);
        identifies.push({
          groupType: 'ds_symbol',
          groupKey: key,
          properties: {
            package_name: imp.packageName,
            symbol_name: imp.symbolName,
            symbol_type: imp.symbolType,
          },
        });
      }
    }
  }

  return identifies;
}

export interface SendScanReportOptions {
  client: PostHogLike;
  scannerVersion?: string;
}

/**
 * Send a scan report to PostHog. Returns the number of events sent.
 */
export async function sendScanReport(
  report: ScanReport,
  opts: SendScanReportOptions,
): Promise<number> {
  const { client, scannerVersion } = opts;

  const identifies = buildGroupIdentifies(report);
  for (const id of identifies) {
    client.groupIdentify(id);
  }

  const events = buildScanEvents(report, { scannerVersion });
  for (const event of events) {
    client.capture(event);
  }

  return events.length;
}

/**
 * Create a dry-run PostHog client that prints events as JSON to a sink function.
 * Useful for local testing without an API key.
 */
export function createDryRunClient(
  sink: (line: string) => void = line => console.log(line),
): PostHogLike {
  return {
    capture(payload: CapturePayload): void {
      sink(JSON.stringify({ type: 'capture', ...payload }));
    },
    groupIdentify(payload: GroupIdentifyPayload): void {
      sink(JSON.stringify({ type: 'groupIdentify', ...payload }));
    },
  };
}

/** Exported for documentation — default host used when POSTHOG_HOST is unset. */
export { DEFAULT_POSTHOG_HOST };

// ── Internal builders ───────────────────────────────────────────────────────

function buildRepoEvents(repo: RepositoryUsage, ts: string): CapturePayload[] {
  const events: CapturePayload[] = [];
  const repoId = `repo:${repo.name}`;

  // ds_repo_scanned — stable distinctId so weekly scans stitch into a timeline
  events.push({
    distinctId: repoId,
    event: 'ds_repo_scanned',
    properties: {
      $timestamp: ts,
      $groups: { repo: repo.name },
      repo_name: repo.name,
      url: repo.url,
      default_branch: repo.defaultBranch,
      last_commit_date: repo.lastCommitDate,
      visibility: repo.repoMetadata?.visibility ?? null,
      archived: repo.repoMetadata?.archived ?? false,
      framework: repo.repoMetadata?.framework ?? null,
      primary_language: repo.repoMetadata?.primaryLanguage ?? null,
      is_monorepo: repo.repoMetadata?.isMonorepo ?? false,
      workspace_count: repo.workspaces.length,
      ds_package_count: repo.designSystemPackages.length,
      component_instance_count: repo.componentUsage.reduce(
        (sum, c) => sum + c.instanceCount,
        0,
      ),
      import_usage_count: repo.importUsage.length,
      css_override_count: (repo.cssOverrides ?? []).length,
    },
  });

  // ds_package_used — one per @entur/* package
  for (const pkg of repo.designSystemPackages) {
    events.push(buildPackageEvent(repo.name, pkg, ts));
  }

  // ds_component_used — one per JSX component (react-scanner)
  for (const comp of repo.componentUsage) {
    events.push(buildComponentEvent(repo.name, comp, ts));
  }

  // ds_symbol_used — one per non-JSX import (import analyzer)
  for (const imp of repo.importUsage) {
    events.push(buildSymbolEvent(repo.name, imp, ts));
  }

  // ds_css_override — one per .eds-* override finding
  for (const override of repo.cssOverrides ?? []) {
    events.push(buildCssOverrideEvent(repo.name, override, ts));
  }

  return events;
}

function buildPackageEvent(
  repoName: string,
  pkg: PackageUsage,
  ts: string,
): CapturePayload {
  return {
    distinctId: `repo:${repoName}:package:${pkg.name}`,
    event: 'ds_package_used',
    properties: {
      $timestamp: ts,
      $groups: { repo: repoName, ds_package: pkg.name },
      repo_name: repoName,
      package_name: pkg.name,
      version: pkg.version,
      resolved_version: pkg.resolvedVersion ?? null,
      is_dev: pkg.isDev,
      is_imported: pkg.isImported,
      files_importing_count: pkg.filesImportingCount,
      symbol_count_used: pkg.symbolCountUsed,
    },
  };
}

function buildComponentEvent(
  repoName: string,
  comp: ComponentUsage,
  ts: string,
): CapturePayload {
  const groupKey = `${comp.packageName}::${comp.componentName}`;
  return {
    distinctId: `repo:${repoName}:component:${groupKey}`,
    event: 'ds_component_used',
    properties: {
      $timestamp: ts,
      $groups: {
        repo: repoName,
        ds_package: comp.packageName,
        ds_component: groupKey,
      },
      repo_name: repoName,
      package_name: comp.packageName,
      component_name: comp.componentName,
      instance_count: comp.instanceCount,
      file_count: comp.files.length,
      import_style: comp.importStyle,
      is_aliased: comp.isAliased,
      deep_import_path: comp.deepImportPath ?? null,
      props_spread_count: comp.propsSpreadCount,
    },
  };
}

function buildSymbolEvent(
  repoName: string,
  imp: ImportUsage,
  ts: string,
): CapturePayload {
  const groupKey = `${imp.packageName}::${imp.symbolName}`;
  return {
    distinctId: `repo:${repoName}:symbol:${groupKey}`,
    event: 'ds_symbol_used',
    properties: {
      $timestamp: ts,
      $groups: {
        repo: repoName,
        ds_package: imp.packageName,
        ds_symbol: groupKey,
      },
      repo_name: repoName,
      package_name: imp.packageName,
      symbol_name: imp.symbolName,
      symbol_type: imp.symbolType,
      reference_count: imp.referenceCount,
      files_used_in: imp.filesUsedIn,
      import_style: imp.importStyle,
      is_aliased: imp.isAliased,
    },
  };
}

function buildCssOverrideEvent(
  repoName: string,
  override: CssOverrideFinding,
  ts: string,
): CapturePayload {
  return {
    distinctId: `repo:${repoName}:css:${override.filePath}:${override.lineNumber}`,
    event: 'ds_css_override',
    properties: {
      $timestamp: ts,
      $groups: { repo: repoName },
      repo_name: repoName,
      selector: override.selector,
      file_path: override.filePath,
      line_number: override.lineNumber,
      file_extension: override.fileExtension,
    },
  };
}
