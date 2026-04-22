import {
  buildScanEvents,
  buildGroupIdentifies,
  sendScanReport,
  createDryRunClient,
} from './posthogClient';
import type { ScanReport } from '../types';

const FIXED_TS = '2025-01-06T06:00:00.000Z';

const FIXTURE_REPORT: ScanReport = {
  timestamp: FIXED_TS,
  source: 'github-actions',
  scanRun: {
    scanId: 'test-scan-id',
    scanTimestamp: FIXED_TS,
    scannerVersion: '0.2.0',
    totalReposDiscovered: 2,
    totalReposScanned: 2,
    totalReposFailed: 0,
    scanStatus: 'success',
  },
  totalReposScanned: 2,
  reposWithUsage: 1,
  limitations: [],
  repositories: [
    {
      name: 'entur/my-app',
      url: 'https://github.com/entur/my-app',
      defaultBranch: 'main',
      lastCommitDate: '2025-01-05T12:00:00.000Z',
      repoMetadata: {
        visibility: 'internal',
        archived: false,
        primaryLanguage: 'TypeScript',
        createdAt: '2020-01-01T00:00:00.000Z',
        pushedAt: '2025-01-05T12:00:00.000Z',
        isMonorepo: false,
        framework: 'next',
        reactVersion: '18.3.1',
      },
      workspaces: [],
      designSystemPackages: [
        {
          name: '@entur/button',
          version: '^4.0.0',
          resolvedVersion: '4.0.5',
          isDev: false,
          isImported: true,
          filesImportingCount: 3,
          symbolCountUsed: 2,
        },
        {
          name: '@entur/tokens',
          version: '^3.0.0',
          resolvedVersion: undefined,
          isDev: false,
          isImported: true,
          filesImportingCount: 5,
          symbolCountUsed: 1,
        },
      ],
      otherUILibraries: [],
      componentUsage: [
        {
          packageName: '@entur/button',
          componentName: 'PrimaryButton',
          instanceCount: 7,
          props: { onClick: 3, disabled: 1 },
          propsSpreadCount: 0,
          files: ['src/App.tsx', 'src/Header.tsx'],
          importStyle: 'named',
          isAliased: false,
        },
      ],
      importUsage: [
        {
          packageName: '@entur/tokens',
          symbolName: 'colors',
          symbolType: 'token',
          importStyle: 'named',
          isAliased: false,
          referenceCount: 4,
          filesUsedIn: 2,
        },
      ],
      cssOverrides: [
        {
          selector: '.eds-primary-button',
          filePath: 'src/styles/overrides.scss',
          lineNumber: 12,
          fileExtension: '.scss',
        },
      ],
      fileFindings: undefined,
    },
    {
      name: 'entur/no-ds-app',
      url: 'https://github.com/entur/no-ds-app',
      defaultBranch: 'main',
      lastCommitDate: '2025-01-04T10:00:00.000Z',
      workspaces: [],
      designSystemPackages: [],
      otherUILibraries: [],
      componentUsage: [],
      importUsage: [],
      cssOverrides: [],
    },
  ],
};

describe('buildScanEvents', () => {
  it('emits exactly one ds_scan_run event', () => {
    const events = buildScanEvents(FIXTURE_REPORT, { scannerVersion: '0.2.0' });
    const scanRunEvents = events.filter(e => e.event === 'ds_scan_run');
    expect(scanRunEvents).toHaveLength(1);
  });

  it('ds_scan_run has correct properties', () => {
    const events = buildScanEvents(FIXTURE_REPORT, { scannerVersion: '0.2.0' });
    const scanRun = events.find(e => e.event === 'ds_scan_run')!;

    expect(scanRun.distinctId).toBe('scan-run:test-scan-id');
    expect(scanRun.properties.total_repos_scanned).toBe(2);
    expect(scanRun.properties.repos_with_usage).toBe(1);
    expect(scanRun.properties.scanner_version).toBe('0.2.0');
    expect(scanRun.properties.source).toBe('github-actions');
    expect(scanRun.properties.scan_status).toBe('success');
    expect(scanRun.properties.$timestamp).toBe(FIXED_TS);
  });

  it('emits one ds_repo_scanned per repository', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const repoEvents = events.filter(e => e.event === 'ds_repo_scanned');
    expect(repoEvents).toHaveLength(2);
  });

  it('ds_repo_scanned distinctId is stable repo:<name> for weekly timelines', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const repoEvent = events.find(
      e =>
        e.event === 'ds_repo_scanned' &&
        e.properties.repo_name === 'entur/my-app',
    )!;
    expect(repoEvent.distinctId).toBe('repo:entur/my-app');
  });

  it('ds_repo_scanned includes repoMetadata fields', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const repoEvent = events.find(
      e =>
        e.event === 'ds_repo_scanned' &&
        e.properties.repo_name === 'entur/my-app',
    )!;

    expect(repoEvent.properties.visibility).toBe('internal');
    expect(repoEvent.properties.archived).toBe(false);
    expect(repoEvent.properties.framework).toBe('next');
    expect(repoEvent.properties.react_version).toBe('18.3.1');
    expect(repoEvent.properties.primary_language).toBe('TypeScript');
    expect(repoEvent.properties.is_monorepo).toBe(false);
  });

  it('ds_repo_scanned includes usage counts', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const repoEvent = events.find(
      e =>
        e.event === 'ds_repo_scanned' &&
        e.properties.repo_name === 'entur/my-app',
    )!;

    expect(repoEvent.properties.ds_package_count).toBe(2);
    expect(repoEvent.properties.component_instance_count).toBe(7);
    expect(repoEvent.properties.import_usage_count).toBe(1);
    expect(repoEvent.properties.css_override_count).toBe(1);
    expect(repoEvent.properties.workspace_count).toBe(0);
  });

  it('emits one ds_package_used per design system package', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const pkgEvents = events.filter(e => e.event === 'ds_package_used');
    expect(pkgEvents).toHaveLength(2);
  });

  it('ds_package_used has correct distinctId and properties', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const pkgEvent = events.find(
      e =>
        e.event === 'ds_package_used' &&
        e.properties.package_name === '@entur/button',
    )!;

    expect(pkgEvent.distinctId).toBe('repo:entur/my-app:package:@entur/button');
    expect(pkgEvent.properties.version).toBe('^4.0.0');
    expect(pkgEvent.properties.resolved_version).toBe('4.0.5');
    expect(pkgEvent.properties.is_dev).toBe(false);
    expect(pkgEvent.properties.is_imported).toBe(true);
    expect(pkgEvent.properties.files_importing_count).toBe(3);
    expect(pkgEvent.properties.symbol_count_used).toBe(2);
  });

  it('ds_package_used resolved_version is null when undefined', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const pkgEvent = events.find(
      e =>
        e.event === 'ds_package_used' &&
        e.properties.package_name === '@entur/tokens',
    )!;
    expect(pkgEvent.properties.resolved_version).toBeNull();
  });

  it('emits one ds_component_used per component', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const compEvents = events.filter(e => e.event === 'ds_component_used');
    expect(compEvents).toHaveLength(1);
  });

  it('ds_component_used has correct properties', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const compEvent = events.find(e => e.event === 'ds_component_used')!;

    expect(compEvent.distinctId).toBe(
      'repo:entur/my-app:component:@entur/button::PrimaryButton',
    );
    expect(compEvent.properties.package_name).toBe('@entur/button');
    expect(compEvent.properties.component_name).toBe('PrimaryButton');
    expect(compEvent.properties.instance_count).toBe(7);
    expect(compEvent.properties.file_count).toBe(2);
    expect(compEvent.properties.import_style).toBe('named');
    expect(compEvent.properties.is_aliased).toBe(false);
    expect(compEvent.properties.props_spread_count).toBe(0);
  });

  it('emits one ds_symbol_used per import usage', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const symbolEvents = events.filter(e => e.event === 'ds_symbol_used');
    expect(symbolEvents).toHaveLength(1);
  });

  it('ds_symbol_used has correct properties', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const symbolEvent = events.find(e => e.event === 'ds_symbol_used')!;

    expect(symbolEvent.distinctId).toBe(
      'repo:entur/my-app:symbol:@entur/tokens::colors',
    );
    expect(symbolEvent.properties.package_name).toBe('@entur/tokens');
    expect(symbolEvent.properties.symbol_name).toBe('colors');
    expect(symbolEvent.properties.symbol_type).toBe('token');
    expect(symbolEvent.properties.reference_count).toBe(4);
    expect(symbolEvent.properties.files_used_in).toBe(2);
    expect(symbolEvent.properties.import_style).toBe('named');
  });

  it('emits one ds_css_override per override finding', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const overrideEvents = events.filter(e => e.event === 'ds_css_override');
    expect(overrideEvents).toHaveLength(1);
  });

  it('ds_css_override has correct properties', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const overrideEvent = events.find(e => e.event === 'ds_css_override')!;

    expect(overrideEvent.distinctId).toBe(
      'repo:entur/my-app:css:src/styles/overrides.scss:12',
    );
    expect(overrideEvent.properties.selector).toBe('.eds-primary-button');
    expect(overrideEvent.properties.file_path).toBe(
      'src/styles/overrides.scss',
    );
    expect(overrideEvent.properties.line_number).toBe(12);
    expect(overrideEvent.properties.file_extension).toBe('.scss');
  });

  it('all events have $timestamp set to report.timestamp', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    for (const event of events) {
      expect(event.properties.$timestamp).toBe(FIXED_TS);
    }
  });

  it('repo with no usage emits only ds_repo_scanned (no package/component/override events)', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const noAppEvents = events.filter(
      e =>
        e.properties.repo_name === 'entur/no-ds-app' &&
        e.event !== 'ds_repo_scanned',
    );
    expect(noAppEvents).toHaveLength(0);
  });
});

describe('buildGroupIdentifies', () => {
  it('creates one repo group per repository', () => {
    const identifies = buildGroupIdentifies(FIXTURE_REPORT);
    const repoGroups = identifies.filter(i => i.groupType === 'repo');
    expect(repoGroups).toHaveLength(2);
  });

  it('repo group includes metadata properties', () => {
    const identifies = buildGroupIdentifies(FIXTURE_REPORT);
    const repoGroup = identifies.find(
      i => i.groupType === 'repo' && i.groupKey === 'entur/my-app',
    )!;

    expect(repoGroup.properties.name).toBe('entur/my-app');
    expect(repoGroup.properties.visibility).toBe('internal');
    expect(repoGroup.properties.framework).toBe('next');
    expect(repoGroup.properties.react_version).toBe('18.3.1');
  });

  it('creates ds_package groups deduplicated across repos', () => {
    // both repos share no packages, so should have 2 (button + tokens)
    const identifies = buildGroupIdentifies(FIXTURE_REPORT);
    const pkgGroups = identifies.filter(i => i.groupType === 'ds_package');
    expect(pkgGroups).toHaveLength(2);
  });

  it('deduplicates packages when same package appears in multiple repos', () => {
    const reportWithDupe: ScanReport = {
      ...FIXTURE_REPORT,
      repositories: [
        FIXTURE_REPORT.repositories[0],
        {
          ...FIXTURE_REPORT.repositories[0],
          name: 'entur/another-app',
          url: 'https://github.com/entur/another-app',
        },
      ],
    };

    const identifies = buildGroupIdentifies(reportWithDupe);
    const pkgGroups = identifies.filter(i => i.groupType === 'ds_package');
    const pkgKeys = pkgGroups.map(g => g.groupKey);
    const uniqueKeys = new Set(pkgKeys);
    expect(pkgKeys.length).toBe(uniqueKeys.size);
  });

  it('creates ds_component groups', () => {
    const identifies = buildGroupIdentifies(FIXTURE_REPORT);
    const compGroups = identifies.filter(i => i.groupType === 'ds_component');
    expect(compGroups).toHaveLength(1);
    expect(compGroups[0].groupKey).toBe('@entur/button::PrimaryButton');
  });

  it('creates ds_symbol groups', () => {
    const identifies = buildGroupIdentifies(FIXTURE_REPORT);
    const symbolGroups = identifies.filter(i => i.groupType === 'ds_symbol');
    expect(symbolGroups).toHaveLength(1);
    expect(symbolGroups[0].groupKey).toBe('@entur/tokens::colors');
  });
});

describe('sendScanReport', () => {
  it('calls capture for each event and groupIdentify for each group', async () => {
    const capturedEvents: unknown[] = [];
    const capturedGroups: unknown[] = [];

    const mockClient = {
      capture: (payload: unknown) => capturedEvents.push(payload),
      groupIdentify: (payload: unknown) => capturedGroups.push(payload),
    };

    const count = await sendScanReport(FIXTURE_REPORT, {
      client: mockClient,
      scannerVersion: '0.2.0',
    });

    expect(count).toBeGreaterThan(0);
    expect(capturedEvents.length).toBe(count);
    expect(capturedGroups.length).toBeGreaterThan(0);
  });

  it('returns the number of events sent', async () => {
    const events = buildScanEvents(FIXTURE_REPORT, { scannerVersion: '0.2.0' });
    const mockClient = { capture: jest.fn(), groupIdentify: jest.fn() };

    const count = await sendScanReport(FIXTURE_REPORT, {
      client: mockClient,
      scannerVersion: '0.2.0',
    });

    expect(count).toBe(events.length);
  });

  it('flushes in batches when client supports flush', async () => {
    let flushCount = 0;
    const mockClient = {
      capture: jest.fn(),
      groupIdentify: jest.fn(),
      flush: jest.fn().mockImplementation(async () => {
        flushCount++;
      }),
    };

    await sendScanReport(FIXTURE_REPORT, {
      client: mockClient,
      scannerVersion: '0.2.0',
      flushBatchSize: 3,
    });

    // With small batch size, should flush multiple times
    expect(flushCount).toBeGreaterThan(0);
    expect(mockClient.flush).toHaveBeenCalled();
  });

  it('works without flush when client does not support it', async () => {
    const mockClient = { capture: jest.fn(), groupIdentify: jest.fn() };

    // Should not throw even without flush method
    const count = await sendScanReport(FIXTURE_REPORT, {
      client: mockClient,
      scannerVersion: '0.2.0',
    });

    expect(count).toBeGreaterThan(0);
  });
});

describe('createDryRunClient', () => {
  it('routes capture events through the sink', () => {
    const lines: string[] = [];
    const client = createDryRunClient(line => lines.push(line));

    client.capture({
      distinctId: 'test-id',
      event: 'ds_scan_run',
      properties: { foo: 'bar' },
    });

    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]);
    expect(parsed.type).toBe('capture');
    expect(parsed.event).toBe('ds_scan_run');
    expect(parsed.properties.foo).toBe('bar');
  });

  it('routes groupIdentify calls through the sink', () => {
    const lines: string[] = [];
    const client = createDryRunClient(line => lines.push(line));

    client.groupIdentify({
      groupType: 'repo',
      groupKey: 'entur/test',
      properties: { name: 'entur/test' },
    });

    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]);
    expect(parsed.type).toBe('groupIdentify');
    expect(parsed.groupType).toBe('repo');
  });
});
