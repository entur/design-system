# Design System Usage Scanner

Scans whitelisted GitHub repositories for `@entur/*` design system usage and stores the results in a GCS bucket.

## What it does

1. Reads a whitelist of repos from `repos.json`
2. Shallow-clones each repo
3. Analyzes `package.json` for `@entur/*` dependencies and other UI libraries
4. Uses [react-scanner](https://github.com/moroshko/react-scanner) (AST-based) to detect actual component usage: JSX instances, prop usage, and spread props
5. Outputs a JSON report

## Local usage

```bash
# Scan a local directory
yarn start --local /path/to/repo

# Scan with output file
yarn start --local /path/to/repo --output report.json

# Scan repos from whitelist (requires GitHub token)
yarn start --whitelist repos.json --token ghp_xxx --output report.json
```

## CLI options

| Option                   | Description                               |
| ------------------------ | ----------------------------------------- |
| `--local, -l <path>`     | Scan a local directory                    |
| `--whitelist, -w <path>` | Path to JSON whitelist file               |
| `--token, -t <token>`    | GitHub token (required for `--whitelist`) |
| `--output <path>`        | Write JSON report to file                 |
| `--concurrency <n>`      | Max parallel clones (default: 2)          |

## Whitelist format

```json
{
  "repositories": ["entur/abzu", "entur/tavla"]
}
```

## Output format

The scan report includes per-repo:

- **designSystemPackages**: `@entur/*` packages with versions
- **otherUILibraries**: Non-DS UI libraries (MUI, styled-components, etc.)
- **componentUsage**: Per-component instance counts, prop usage stats, and spread prop detection

## GitHub Actions

The scanner runs as a GitHub Actions workflow (`.github/workflows/design-system-usage-scan.yml`):

- **Weekly** (Monday 06:00 UTC) + manual dispatch
- **PR smoke test**: Builds, tests, and runs a local scan on PRs that touch scanner files
- **Full scan**: Clones whitelisted repos, runs analysis, uploads to GCS

## Infrastructure setup

See the plan document for full setup details. Summary:

1. **GitHub App** (`SCANNER_APP_ID`, `SCANNER_APP_PRIVATE_KEY`) — for reading whitelisted repos
2. **GCS bucket** (`entur-design-system-scanner`) — private, via Entur Terraform module
3. **WIF** — already configured via `.entur/github-design-system.yaml` (`prd` environment)
4. **Slack webhook** (`SLACK_WEBHOOK_URL`) — for failure notifications

## Known limitations

- Re-exports through barrel files are not followed — only direct `@entur/*` imports are detected
- `React.lazy()` and dynamic imports are not detected
- Aliased imports (e.g., `import { Button as Btn }`) are tracked as separate component names
- Only JSX renders are counted — programmatic usage (`createElement`) is not detected

## Development

```bash
yarn build     # Compile TypeScript
yarn test      # Run tests
yarn start     # Run via tsx (no build needed)
```
