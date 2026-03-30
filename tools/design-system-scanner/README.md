# Design System Usage Scanner

Scans Entur GitHub repositories for `@entur/*` design system usage and loads results into BigQuery for analysis.

## What it does

1. Discovers repos via GitHub code search (finds all repos with `@entur/*` in `package.json`)
2. Shallow-clones each repo and fetches metadata via GitHub API
3. Analyzes each repo across multiple dimensions:
   - **Package analysis** — `@entur/*` dependencies, other UI libraries (MUI, styled-components, etc.), framework detection, monorepo workspace detection
   - **Version resolution** — resolves actual installed versions from `yarn.lock`
   - **JSX component usage** — uses [react-scanner](https://github.com/moroshko/react-scanner) (AST/Babel) for component instance counts, prop usage statistics, and spread prop detection
   - **Non-JSX import usage** — TypeScript AST analysis for hooks, utilities, tokens and other non-JSX imports
   - **CSS override detection** — finds `.eds-*` CSS selector overrides
4. Aggregates per-repo results into a scan report
5. Exports NDJSON files for loading into BigQuery
6. Loads results directly into BigQuery and saves artifacts to GitHub Actions

## GitHub Actions pipeline

The scanner runs via `.github/workflows/design-system-usage-scan.yml`:

- **Weekly** (Mondays 06:00 UTC) + manual dispatch
- **PR smoke test**: Builds, tests, and runs a local scan on PRs that touch scanner files
- Three jobs: `discover` → `scan-repo` (matrix, parallel per repo) → `aggregate`

## Local usage

```bash
# Scan a local directory
yarn start --local /path/to/repo

# Scan with output file and repo metadata
yarn start --local /path/to/repo --repo-name entur/abzu --output result.json

# Aggregate per-repo results into a scan report
yarn start --aggregate ./scan-results --total-repos 95 --output scan-report.json

# Export scan report as NDJSON for BigQuery loading
yarn start --bigquery-export scan-report.json --output ./bq-export/

# Export with catalog for unused symbol detection
yarn start --bigquery-export scan-report.json --catalog catalog.json --output ./bq-export/
```

## CLI reference

### Modes

| Mode                       | Description                                  |
| -------------------------- | -------------------------------------------- |
| `--local <path>`           | Scan a single local repository               |
| `--aggregate <path>`       | Merge per-repo JSON results from a directory |
| `--bigquery-export <path>` | Export a scan report as NDJSON for BigQuery  |

### Options

| Option                      | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `--repo-name <owner/repo>`  | Repository name (default: directory basename)         |
| `--repo-url <url>`          | Repository URL                                        |
| `--default-branch <branch>` | Default branch name                                   |
| `--last-commit <iso-date>`  | Last commit timestamp                                 |
| `--total-repos <n>`         | Total repos discovered (for report metadata)          |
| `--catalog <path>`          | Path to `catalog.json` for unused symbol detection    |
| `--output <path>`           | Write results to file or directory                    |
| `--visibility <vis>`        | Repository visibility (`public`/`private`/`internal`) |
| `--archived <bool>`         | Whether repo is archived                              |
| `--primary-language <lang>` | Primary language from GitHub                          |
| `--created-at <iso-date>`   | Repo creation date                                    |
| `--include-file-findings`   | Collect per-file findings for drilldown               |
| `--help, -h`                | Show help                                             |

## BigQuery output format

`--bigquery-export` produces up to 6 NDJSON files, one row per entity:

**`scan_runs.ndjson`** — One row per scan execution. Contains scan metadata: scan ID, timestamp, scanner version, total repos discovered/scanned/failed, and overall scan status (`success` / `partial` / `failure`).

**`repos.ndjson`** — One row per repository. Contains repo metadata (name, URL, visibility, archived status, primary language, creation date) and summary stats: whether it's a monorepo, detected framework (e.g. `next`, `vite`), and counts for DS packages used, other UI libraries, component instances, and CSS overrides.

**`repo_package_usage.ndjson`** — One row per `(repo, package)` pair. Covers both `@entur/*` packages and other detected UI libraries (MUI, styled-components, etc.). Includes version from `package.json`, resolved version from the lockfile, whether it's a dev dependency, and how many files and symbols from that package are actually used.

**`repo_symbol_usage.ndjson`** — One row per `(repo, symbol)`. Merges data from react-scanner (JSX renders) and the import analyzer (hooks, utils, tokens). Fields include symbol type, instance count, reference count, import style, whether it's aliased, number of files it appears in, and per-prop usage counts. The `finding_source` field indicates which analyzer(s) detected the symbol (`react-scanner`, `import-analyzer`, `both`, or `catalog-zero` for installed-but-unused symbols).

**`repo_workspaces.ndjson`** — One row per `(repo, workspace)` in monorepos. Contains workspace name, relative path, type (`app` / `package`), detected framework, and count of DS packages used in that workspace.

**`file_findings.ndjson`** — One row per file-level finding (requires `--include-file-findings`). Enables drilldown into exactly which files import or render which symbols, with the file path, extension, finding type (`import` / `jsx_usage`), line number, and flags for test/Storybook/generated files.

Optional catalog export (requires `--catalog`):

**`ds_catalog.ndjson`** — One row per exported symbol in the design system. Contains package name, latest published version, symbol name, type, and known prop names. Useful for identifying which DS symbols exist but are never used across scanned repos.

**`repo_css_overrides.ndjson`** — One row per `.eds-*` CSS selector override found in a repo. Contains repo name, selector, file path, line number, and file extension. Only produced when overrides are detected.

## Infrastructure setup

Before the full pipeline can run, the following must be in place:

1. **GitHub App** (`SCANNER_GITHUB_APP`) — for reading code and repo metadata across the org. Requires org admin approval.
2. **BigQuery dataset** (`ent-edsscan-prd.design_system_scanner`) — provisioned in the infrastructure repo.
3. **WIF authentication** — already configured via `.entur/github-design-system.yaml`. Vars `CI_WORKLOAD_IDENTITY_PROVIDER` and `CI_SERVICE_ACCOUNT` must be set in the `prd` GitHub Environment.
4. **Slack** (`SLACK_INTERNAL_CHANNEL_ID`) — bot must be invited to the channel for failure notifications.

## Catalog

`catalog.json` is a generated snapshot of all exported symbols from `@entur/*` packages in this repo. It is used to identify which DS symbols are unused across scanned repos.

```bash
# Regenerate from source packages
yarn generate-catalog

# Verify catalog is up to date
yarn verify-catalog
```

## Development

```bash
yarn build        # Compile TypeScript
yarn test         # Run tests
yarn start        # Run via tsx (no build step needed)
yarn scan:local   # Shortcut for --local mode
```

## Known limitations

- Re-exports through barrel files are not followed — only direct `@entur/*` imports are detected
- `React.lazy()` and other dynamic imports are not detected
- Aliased imports (e.g., `import { Button as Btn }`) are tracked as separate component names
- Only JSX renders are counted — programmatic usage (`createElement`) is not detected
- Hook/util/token detection uses name-based heuristics and may misclassify some symbols
