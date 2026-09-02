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
   - **Internal class name usage** — finds `.eds-*` class names in stylesheets, CSS-in-JS template literals, and `className` attributes, classified by owning package and style generation (legacy vs beta)
   - **Colour token usage** — resolves `var(--x)`, `$x`, `@x`, inline styles, and member access on `@entur/tokens` objects to individual tokens, and flags hardcoded colours — including which ones already exist as a token
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

| Option                      | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `--repo-name <owner/repo>`  | Repository name (default: directory basename)          |
| `--repo-url <url>`          | Repository URL                                         |
| `--default-branch <branch>` | Default branch name                                    |
| `--last-commit <iso-date>`  | Last commit timestamp                                  |
| `--total-repos <n>`         | Total repos discovered (for report metadata)           |
| `--catalog <path>`          | Path to `catalog.json` for unused symbol detection     |
| `--output <path>`           | Write results to file or directory                     |
| `--visibility <vis>`        | Repository visibility (`public`/`private`/`internal`)  |
| `--archived <bool>`         | Whether repo is archived                               |
| `--primary-language <lang>` | Primary language from GitHub                           |
| `--created-at <iso-date>`   | Repo creation date                                     |
| `--include-file-findings`   | Collect per-file findings for drilldown                |
| `--packages-root <path>`    | Design system `packages/` dir (default: auto-detected) |
| `--owner-teams <a,b>`       | Owning teams for `--local` (default: CODEOWNERS)       |
| `--team-map <path>`         | repo → teams JSON applied during `--aggregate`         |
| `--posthog-export <path>`   | Path to scan-report.json to send to PostHog            |
| `--posthog-dry-run`         | Print PostHog events as JSON, don't send               |
| `--posthog-host <url>`      | PostHog host (default: `https://eu.i.posthog.com`)     |
| `--posthog-key <key>`       | PostHog API key (default: `POSTHOG_API_KEY` env var)   |
| `--help, -h`                | Show help                                              |

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

| Event                 | One per                    | Key properties                                                                                     |
| --------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| `ds_scan_run`         | scan execution             | `total_repos_scanned`, `repos_with_usage`, `scan_status`, `scanner_version`                        |
| `ds_repo_scanned`     | repository                 | `visibility`, `framework`, `is_monorepo`, `ds_package_count`, `component_instance_count`, rollups  |
| `ds_package_used`     | (repo, `@entur/*` package) | `package_name`, `version`, `resolved_version`, `is_imported`, `symbol_count_used`                  |
| `ds_component_used`   | (repo, JSX component)      | `component_name`, `package_name`, `instance_count`, `file_count`, `props_spread_count`             |
| `ds_symbol_used`      | (repo, non-JSX symbol)     | `symbol_name`, `symbol_type`, `reference_count`, `files_used_in`, `deep_import_path`               |
| `ds_css_override`     | (repo, internal class use) | `selector`, `package_name`, `base_class`, `class_generation`, `source`, `file_path`, `line_number` |
| `ds_color_token_used` | (repo, colour token)       | `token_name`, `token_layer`, `token_generation`, `occurrence_count`, `file_count`, `sources`       |
| `ds_hardcoded_color`  | (repo, normalised colour)  | `color_value`, `color_format`, `occurrence_count`, `matches_token_name`, `matches_token_layer`     |
| `ds_repo_team`        | (repo, owning team)        | `team_slug`, `team_source`                                                                         |

`package_name` is always the **root** package; a subpath lives only in `deep_import_path`. So
`@entur/typography/beta` is reported as `package_name: "@entur/typography"` with
`deep_import_path: "/beta"`. Filter on `deep_import_path` to isolate a generation — filtering on
the package name cannot distinguish them.

`ds_repo_scanned` also carries repo-level rollups, so a key result is one metric with one filter
rather than something recomputed from component rows each time:

- **Typography** — `typography_has_package`, `typography_version`, `typography_is_dev_dependency`,
  `typography_uses_new`, `typography_uses_legacy`, `typography_new_instance_count`,
  `typography_legacy_instance_count`, `typography_new_share`, `typography_class_override_count`,
  `typography_class_override_legacy_count`, `typography_class_override_beta_count`
- **Colour tokens** — `color_analysis_complete`, `color_style_files_scanned`,
  `color_token_usage_count`, `color_token_distinct_count`, `color_token_legacy_count`,
  `color_token_new_count`, `hardcoded_color_count`, `hardcoded_color_matching_token_count`

`ds_repo_team` exists because PostHog allows only five group types and four are already in use;
one event per (repo, team) makes a team-level share a plain breakdown instead of an array filter.

Events use PostHog Group Analytics with `repo`, `ds_package`, `ds_component`, and `ds_symbol` groups, enabling dashboard breakdowns by e.g. "which packages are used in the most repos" or "repos using PrimaryButton".

Group keys and the event timestamp are sent as **top-level** capture fields, not as `$groups` / `$timestamp` properties. posthog-node ignores those properties, which leaves the event's group columns empty (silently disabling every group breakdown and making `unique_group` aggregations return 0) and attributes each event to its ingestion time. Timestamps are set to the scan's `timestamp`, so weekly scans attribute data to the correct date.

## BigQuery output format

`--bigquery-export` produces up to 9 NDJSON files, one row per entity:

**`scan_runs.ndjson`** — One row per scan execution. Contains scan metadata: scan ID, timestamp, scanner version, total repos discovered/scanned/failed, and overall scan status (`success` / `partial` / `failure`).

**`repos.ndjson`** — One row per repository. Contains repo metadata (name, URL, visibility, archived status, primary language, creation date, owning teams) and summary stats: whether it's a monorepo, detected framework (e.g. `next`, `vite`), and counts for DS packages used, other UI libraries, component instances, and CSS overrides. Also carries the typography and colour token rollups listed under [PostHog export](#events), under the same column names.

**`repo_package_usage.ndjson`** — One row per `(repo, package)` pair. Covers both `@entur/*` packages and other detected UI libraries (MUI, styled-components, etc.). Includes version from `package.json`, resolved version from the lockfile, whether it's a dev dependency, and how many files and symbols from that package are actually used.

**`repo_symbol_usage.ndjson`** — One row per `(repo, symbol)`. Merges data from react-scanner (JSX renders) and the import analyzer (hooks, utils, tokens). Fields include symbol type, instance count, reference count, import style, whether it's aliased, number of files it appears in, and per-prop usage counts. The `finding_source` field indicates which analyzer(s) detected the symbol (`react-scanner`, `import-analyzer`, `both`, or `catalog-zero` for installed-but-unused symbols).

**`repo_workspaces.ndjson`** — One row per `(repo, workspace)` in monorepos. Contains workspace name, relative path, type (`app` / `package`), detected framework, and count of DS packages used in that workspace.

**`file_findings.ndjson`** — One row per file-level finding (requires `--include-file-findings`). Enables drilldown into exactly which files import or render which symbols, with the file path, extension, finding type (`import` / `jsx_usage`), line number, and flags for test/Storybook/generated files.

Optional catalog export (requires `--catalog`):

**`ds_catalog.ndjson`** — One row per exported symbol in the design system. Contains package name, latest published version, symbol name, type, and known prop names. Useful for identifying which DS symbols exist but are never used across scanned repos.

**`repo_css_overrides.ndjson`** — One row per use of an internal `.eds-*` class name. Contains repo name, selector, file path, line number, file extension, and the classification: owning `package_name`, `base_class`, `class_generation` (`legacy` / `beta` / `unknown`), and `source` (`stylesheet` / `css-in-js` / `jsx-classname`). Only produced when findings exist.

**`repo_color_tokens.ndjson`** — One row per `(repo, colour token)`. Contains the token name, its layer (`primitive` / `semantic` / `base` / `data` / `transport` / `component` / `legacy`), generation (`legacy` / `new`), total occurrences, file count, and which sources it was found in.

**`repo_hardcoded_colors.ndjson`** — One row per `(repo, normalised colour value)`. Colours are normalised to lowercase hex, so the same colour written as hex, `rgb()`, or a named colour collapses into one row. `matches_token_name` and `matches_token_layer` are set when the design system already publishes that colour as a token, which is the main signal for where a token migration will bite.

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
- Stylesheets are scanned line by line, so nested SCSS selectors are not expanded
- Class names assembled at runtime from fragments are invisible
- Colour token member access resolves for the legacy `colors` object; the newer token objects use different keys in JS than in CSS, and are consumed as CSS variables in practice
- The class name and colour token catalogue is read from this monorepo's `packages/` sources, so both need the design system checked out alongside the scanner
