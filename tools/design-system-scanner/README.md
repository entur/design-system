# Design System Usage Scanner

Scans Entur GitHub repositories for `@entur/*` design system usage and loads results into BigQuery for analysis.

## What it does

1. Scans the repos it is pointed at — discovery is the orchestrating workflow's job
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

## GitHub Actions

The scan itself runs from an internal repository, which holds the credentials and org
access it needs.

This repo only builds and tests the scanner, via `.github/workflows/scanner-ci.yml` on
PRs that touch scanner files.

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

# Send scan results to PostHog (dry-run)
yarn start --posthog-export scan-report.json --posthog-dry-run

# Send scan results to PostHog
POSTHOG_API_KEY=phc_xxx yarn start --posthog-export scan-report.json
```

## CLI reference

### Modes

| Mode                       | Description                                  |
| -------------------------- | -------------------------------------------- |
| `--local <path>`           | Scan a single local repository               |
| `--aggregate <path>`       | Merge per-repo JSON results from a directory |
| `--bigquery-export <path>` | Export a scan report as NDJSON for BigQuery  |
| `--posthog-export <path>`  | Send a scan report as events to PostHog      |

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
| `--posthog-export <path>`   | Path to scan-report.json to send to PostHog           |
| `--posthog-dry-run`         | Print PostHog events as JSON, don't send              |
| `--posthog-host <url>`      | PostHog host (default: `https://eu.i.posthog.com`)    |
| `--posthog-key <key>`       | PostHog API key (default: `POSTHOG_API_KEY` env var)  |
| `--help, -h`                | Show help                                             |

## PostHog export

The scanner can send usage data to [PostHog](https://posthog.com) for product analytics dashboards.

### Setup

Add `POSTHOG_API_KEY` as a GitHub Actions secret in the repository settings. Optionally set `POSTHOG_HOST` as a variable (defaults to `https://eu.i.posthog.com`).

### Local usage

```bash
# Dry-run: print all events as JSON without sending (no API key needed)
yarn start --posthog-export scan-report.json --posthog-dry-run

# Send to PostHog
POSTHOG_API_KEY=phc_xxx yarn start --posthog-export scan-report.json

# Custom host
POSTHOG_API_KEY=phc_xxx yarn start --posthog-export scan-report.json --posthog-host https://app.posthog.com
```

### Events

| Event               | One per                       | Key properties                                                                           |
| ------------------- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| `ds_scan_run`       | scan execution                | `total_repos_scanned`, `repos_with_usage`, `scan_status`, `scanner_version`              |
| `ds_repo_scanned`   | repository                    | `visibility`, `framework`, `is_monorepo`, `ds_package_count`, `component_instance_count` |
| `ds_package_used`   | (repo, `@entur/*` package)    | `package_name`, `version`, `resolved_version`, `is_imported`, `symbol_count_used`        |
| `ds_component_used` | (repo, JSX component)         | `component_name`, `package_name`, `instance_count`, `file_count`, `props_spread_count`   |
| `ds_symbol_used`    | (repo, non-JSX symbol)        | `symbol_name`, `symbol_type`, `reference_count`, `files_used_in`                         |
| `ds_css_override`   | (repo, `.eds-*` CSS override) | `selector`, `file_path`, `line_number`, `file_extension`                                 |

Events use PostHog Group Analytics with `repo`, `ds_package`, `ds_component`, and `ds_symbol` groups, enabling dashboard breakdowns by e.g. "which packages are used in the most repos" or "repos using PrimaryButton".

Timestamps are set to the scan's `timestamp` (not the send time), so weekly scans attribute data to the correct date.

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
