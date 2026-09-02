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
        codeOwners: ['@entur/team-app'],
        ownerTeams: ['@entur/team-app', '@entur/team-platform'],
        ownerTeamsSource: 'org-team',
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
        {
          name: '@entur/typography',
          version: '^3.0.4',
          resolvedVersion: '3.0.4',
          isDev: false,
          isImported: true,
          filesImportingCount: 4,
          symbolCountUsed: 3,
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
        {
          packageName: '@entur/typography',
          componentName: 'Heading',
          instanceCount: 6,
          props: { variant: 6 },
          propsSpreadCount: 0,
          files: ['src/App.tsx'],
          importStyle: 'named',
          isAliased: false,
          deepImportPath: '/beta',
        },
        {
          packageName: '@entur/typography',
          componentName: 'Heading1',
          instanceCount: 2,
          props: {},
          propsSpreadCount: 0,
          files: ['src/Legacy.tsx'],
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
          packageName: '@entur/button',
          baseClass: 'eds-primary-button',
          classGeneration: 'legacy',
          source: 'stylesheet',
        },
        {
          selector: '.eds-text--paragraph',
          filePath: 'src/styles/typography.scss',
          lineNumber: 4,
          fileExtension: '.scss',
          packageName: '@entur/typography',
          baseClass: 'eds-text',
          classGeneration: 'beta',
          source: 'stylesheet',
        },
        {
          selector: '.eds-h2',
          filePath: 'src/Styled.tsx',
          lineNumber: 21,
          fileExtension: '.tsx',
          packageName: '@entur/typography',
          baseClass: 'eds-h2',
          classGeneration: 'legacy',
          source: 'css-in-js',
        },
      ],
      colorTokenUsage: [
        {
          tokenName: 'fill-background-tint-light',
          tokenLayer: 'semantic',
          tokenGeneration: 'new',
          occurrenceCount: 9,
          fileCount: 3,
          sources: ['stylesheet'],
        },
        {
          tokenName: 'colors-blues-blue50',
          tokenLayer: 'legacy',
          tokenGeneration: 'legacy',
          occurrenceCount: 4,
          fileCount: 2,
          sources: ['js-token-object'],
        },
      ],
      hardcodedColors: [
        {
          value: '#181c56',
          colorFormat: 'hex',
          occurrenceCount: 5,
          fileCount: 2,
          matchesTokenName: 'basecolors-frame-contrast',
          matchesTokenLayer: 'base',
          sources: ['stylesheet'],
        },
        {
          value: '#abcdef',
          colorFormat: 'hex',
          occurrenceCount: 1,
          fileCount: 1,
          sources: ['inline-style'],
        },
      ],
      typographySummary: {
        hasPackage: true,
        packageVersion: '^3.0.4',
        isDevDependency: false,
        usesNewTypography: true,
        usesLegacyTypography: true,
        newInstanceCount: 6,
        legacyInstanceCount: 2,
        newShare: 0.75,
        classOverrideCount: 2,
        classOverrideLegacyCount: 1,
        classOverrideBetaCount: 1,
      },
      colorTokenSummary: {
        analysisComplete: true,
        styleFilesScanned: 12,
        usageCount: 13,
        distinctTokenCount: 2,
        legacyTokenCount: 4,
        newTokenCount: 9,
        hardcodedColorCount: 6,
        hardcodedMatchingTokenCount: 5,
      },
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
      colorTokenUsage: [],
      hardcodedColors: [],
      typographySummary: {
        hasPackage: false,
        packageVersion: null,
        isDevDependency: false,
        usesNewTypography: false,
        usesLegacyTypography: false,
        newInstanceCount: 0,
        legacyInstanceCount: 0,
        newShare: null,
        classOverrideCount: 0,
        classOverrideLegacyCount: 0,
        classOverrideBetaCount: 0,
      },
      colorTokenSummary: {
        analysisComplete: true,
        styleFilesScanned: 0,
        usageCount: 0,
        distinctTokenCount: 0,
        legacyTokenCount: 0,
        newTokenCount: 0,
        hardcodedColorCount: 0,
        hardcodedMatchingTokenCount: 0,
      },
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
    expect(scanRun.timestamp).toEqual(new Date(FIXED_TS));
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

    expect(repoEvent.properties.ds_package_count).toBe(3);
    expect(repoEvent.properties.component_instance_count).toBe(15);
    expect(repoEvent.properties.import_usage_count).toBe(1);
    expect(repoEvent.properties.css_override_count).toBe(3);
    expect(repoEvent.properties.workspace_count).toBe(0);
  });

  it('emits one ds_package_used per design system package', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const pkgEvents = events.filter(e => e.event === 'ds_package_used');
    expect(pkgEvents).toHaveLength(3);
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
    expect(compEvents).toHaveLength(3);
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

  it('ds_repo_scanned carries the typography rollup', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const repoEvent = events.find(
      e =>
        e.event === 'ds_repo_scanned' && e.distinctId === 'repo:entur/my-app',
    )!;

    expect(repoEvent.properties.typography_has_package).toBe(true);
    expect(repoEvent.properties.typography_uses_new).toBe(true);
    expect(repoEvent.properties.typography_uses_legacy).toBe(true);
    expect(repoEvent.properties.typography_new_instance_count).toBe(6);
    expect(repoEvent.properties.typography_legacy_instance_count).toBe(2);
    expect(repoEvent.properties.typography_new_share).toBe(0.75);
    expect(repoEvent.properties.typography_class_override_beta_count).toBe(1);
    expect(repoEvent.properties.typography_is_dev_dependency).toBe(false);
  });

  it('ds_repo_scanned carries the colour token rollup', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const repoEvent = events.find(
      e =>
        e.event === 'ds_repo_scanned' && e.distinctId === 'repo:entur/my-app',
    )!;

    expect(repoEvent.properties.color_analysis_complete).toBe(true);
    expect(repoEvent.properties.color_token_usage_count).toBe(13);
    expect(repoEvent.properties.color_token_legacy_count).toBe(4);
    expect(repoEvent.properties.color_token_new_count).toBe(9);
    expect(repoEvent.properties.hardcoded_color_count).toBe(6);
    expect(repoEvent.properties.hardcoded_color_matching_token_count).toBe(5);
  });

  it('emits one ds_color_token_used per token with its layer', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const tokenEvents = events.filter(e => e.event === 'ds_color_token_used');
    expect(tokenEvents).toHaveLength(2);

    const semantic = tokenEvents.find(
      e => e.properties.token_name === 'fill-background-tint-light',
    )!;
    expect(semantic.distinctId).toBe(
      'repo:entur/my-app:colortoken:fill-background-tint-light',
    );
    expect(semantic.properties.token_layer).toBe('semantic');
    expect(semantic.properties.token_generation).toBe('new');
    expect(semantic.properties.occurrence_count).toBe(9);

    const legacy = tokenEvents.find(
      e => e.properties.token_name === 'colors-blues-blue50',
    )!;
    expect(legacy.properties.token_generation).toBe('legacy');
  });

  it('emits ds_hardcoded_color and flags values that exist as a token', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const colorEvents = events.filter(e => e.event === 'ds_hardcoded_color');
    expect(colorEvents).toHaveLength(2);

    const matching = colorEvents.find(
      e => e.properties.color_value === '#181c56',
    )!;
    expect(matching.properties.matches_token_name).toBe(
      'basecolors-frame-contrast',
    );
    expect(matching.properties.matches_token_layer).toBe('base');

    const unmatched = colorEvents.find(
      e => e.properties.color_value === '#abcdef',
    )!;
    expect(unmatched.properties.matches_token_name).toBeNull();
  });

  it('emits one ds_repo_team per owning team', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const teamEvents = events.filter(e => e.event === 'ds_repo_team');
    expect(teamEvents).toHaveLength(2);

    const slugs = teamEvents.map(e => e.properties.team_slug).sort();
    expect(slugs).toEqual(['@entur/team-app', '@entur/team-platform']);
    expect(teamEvents[0].properties.team_source).toBe('org-team');
  });

  it('ds_css_override carries the package, base class and generation', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const overrideEvents = events.filter(e => e.event === 'ds_css_override');

    const beta = overrideEvents.find(
      e => e.properties.selector === '.eds-text--paragraph',
    )!;
    expect(beta.properties.package_name).toBe('@entur/typography');
    expect(beta.properties.base_class).toBe('eds-text');
    expect(beta.properties.class_generation).toBe('beta');
    expect(beta.properties.source).toBe('stylesheet');

    const cssInJs = overrideEvents.find(
      e => e.properties.selector === '.eds-h2',
    )!;
    expect(cssInJs.properties.source).toBe('css-in-js');
    expect(cssInJs.properties.class_generation).toBe('legacy');
  });

  it('emits one ds_css_override per override finding', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    const overrideEvents = events.filter(e => e.event === 'ds_css_override');
    expect(overrideEvents).toHaveLength(3);
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

  it('all events set the top-level timestamp to report.timestamp', () => {
    const events = buildScanEvents(FIXTURE_REPORT);
    for (const event of events) {
      // posthog-node ignores a $timestamp property, so it has to be top-level
      expect(event.timestamp).toEqual(new Date(FIXED_TS));
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
    expect(pkgGroups).toHaveLength(3);
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
    expect(compGroups).toHaveLength(3);
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

describe('group analytics', () => {
  it('sends group keys as a top-level field, not as a property', () => {
    // posthog-node does not read a $groups property. Passing it inside
    // `properties` left every event's group columns empty, which silently
    // disabled group breakdowns and made unique_group aggregations return 0.
    const events = buildScanEvents(FIXTURE_REPORT);

    const repoEvent = events.find(
      e =>
        e.event === 'ds_repo_scanned' && e.distinctId === 'repo:entur/my-app',
    )!;
    expect(repoEvent.groups).toEqual({ repo: 'entur/my-app' });
    expect(repoEvent.properties.$groups).toBeUndefined();

    const componentEvent = events.find(e => e.event === 'ds_component_used')!;
    expect(componentEvent.groups).toMatchObject({
      repo: 'entur/my-app',
      ds_package: '@entur/button',
    });
  });

  it('sets groups on every event that belongs to a repo', () => {
    const events = buildScanEvents(FIXTURE_REPORT);

    for (const event of events) {
      if (event.event === 'ds_scan_run') {
        // Not scoped to a repo
        expect(event.groups).toBeUndefined();
        continue;
      }
      expect(event.groups?.repo).toBeDefined();
    }
  });
});
