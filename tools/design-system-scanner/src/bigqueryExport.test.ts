import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { buildColorTokenSummary, buildTypographySummary } from './rollups';
import type {
  ComponentUsage,
  DesignSystemCatalog,
  RepositoryUsage,
  ScanReport,
} from './types';

const SCANNER_ROOT = path.join(__dirname, '..');
const TSX = require.resolve('tsx/cli');

const link: ComponentUsage = {
  packageName: '@entur/typography',
  componentName: 'Link',
  instanceCount: 1,
  props: { href: 1 },
  propsSpreadCount: 0,
  files: ['Old.tsx'],
  importStyle: 'named',
  isAliased: false,
};

const baseRepo = {
  name: 'entur/my-app',
  url: 'https://github.com/entur/my-app',
  defaultBranch: 'main',
  lastCommitDate: '2025-01-05T12:00:00.000Z',
  workspaces: [],
  designSystemPackages: [
    {
      name: '@entur/typography',
      version: '^3.0.4',
      isDev: false,
      isImported: true,
      filesImportingCount: 2,
      symbolCountUsed: 2,
    },
  ],
  otherUILibraries: [],
  componentUsage: [
    link,
    { ...link, instanceCount: 3, files: ['New.tsx'], deepImportPath: '/beta' },
  ],
  importUsage: [
    {
      packageName: '@entur/typography',
      symbolName: 'Link',
      symbolType: 'component',
      importStyle: 'named',
      isAliased: false,
      referenceCount: 3,
      filesUsedIn: 1,
      deepImportPath: '/beta',
    },
  ],
  cssOverrides: [],
  colorTokenUsage: [],
  hardcodedColors: [],
} as unknown as RepositoryUsage;

const repo: RepositoryUsage = {
  ...baseRepo,
  typographySummary: buildTypographySummary(baseRepo),
  colorTokenSummary: buildColorTokenSummary({
    analysisComplete: false,
    styleFilesScanned: 0,
    colorTokenUsage: [],
    hardcodedColors: [],
  }),
};

const report: ScanReport = {
  timestamp: '2025-01-06T06:00:00.000Z',
  source: 'test',
  totalReposScanned: 1,
  reposWithUsage: 1,
  repositories: [repo],
  limitations: [],
};

const catalog: DesignSystemCatalog = {
  packages: [
    {
      packageName: '@entur/typography',
      latestVersion: null,
      symbols: [
        { symbolName: 'Link', symbolType: 'component', knownProps: [] },
      ],
    },
  ],
};

function readRows(dir: string, file: string): Record<string, unknown>[] {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

describe('BigQuery export', () => {
  let outDir: string;

  beforeAll(() => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scanner-bq-'));
    const reportPath = path.join(outDir, 'report.json');
    const catalogPath = path.join(outDir, 'catalog.json');
    fs.writeFileSync(reportPath, JSON.stringify(report));
    fs.writeFileSync(catalogPath, JSON.stringify(catalog));
    execFileSync(
      process.execPath,
      [
        TSX,
        'src/index.ts',
        '--bigquery-export',
        reportPath,
        '--catalog',
        catalogPath,
        '--output',
        outDir,
      ],
      { cwd: SCANNER_ROOT, stdio: 'pipe' },
    );
  }, 60_000);

  afterAll(() => fs.rmSync(outDir, { recursive: true, force: true }));

  it('merges an import only with the component from the same entry point', () => {
    const links = readRows(outDir, 'repo_symbol_usage.ndjson').filter(
      r => r.symbol_name === 'Link',
    );
    const stable = links.find(r => r.deep_import_path === null);
    const beta = links.find(r => r.deep_import_path === '/beta');

    expect(stable).toMatchObject({
      instance_count: 1,
      finding_source: 'react-scanner',
    });
    expect(beta).toMatchObject({ instance_count: 3, finding_source: 'both' });
    expect(links.filter(r => r.finding_source !== 'catalog-zero')).toHaveLength(
      2,
    );
  });

  it('does not emit a catalog zero row for a symbol used from the root', () => {
    const zero = readRows(outDir, 'repo_symbol_usage.ndjson').filter(
      r => r.finding_source === 'catalog-zero',
    );
    expect(zero).toHaveLength(0);
  });
});
