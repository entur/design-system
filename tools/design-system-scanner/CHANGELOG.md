# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.2](https://github.com/entur/design-system/compare/@entur/design-system-scanner@0.4.1...@entur/design-system-scanner@0.4.2) (2026-08-28)

**Note:** Version bump only for package @entur/design-system-scanner

## [0.4.1](https://github.com/entur/design-system/compare/@entur/design-system-scanner@0.4.0...@entur/design-system-scanner@0.4.1) (2026-08-20)

**Note:** Version bump only for package @entur/design-system-scanner

# 0.4.0 (2026-06-05)

### Bug Fixes

- **design-system-scanner:** only collect @entur/ team owners from CODEOWNERS ([d356495](https://github.com/entur/design-system/commit/d35649543b6b2dac283f241896087a9a3be23de6))

  Filter out individual GitHub usernames — only org team handles are
  relevant for ownership tracking.

- **gha:** prevent PostHog event drops by batching flushes for large scans ([543cbda](https://github.com/entur/design-system/commit/543cbda5737129fee048d92f516083fde0f419c5))

  posthog-node defaults (flushAt=20, maxQueueSize=1000) cause silent event
  drops when scanning 85+ repos. Fix: raise queue limits, flush in batches
  of 500, and extend shutdown timeout to 60s.

### Features

- **design-system-scanner:** add CODEOWNERS parsing to scanner ([aecb8ee](https://github.com/entur/design-system/commit/aecb8eea7c300ee6fa6a981c597e49a3b2350be6))

  Reads CODEOWNERS from scanned repos and includes unique owners in
  scan output, BigQuery export, and PostHog events.

- **root:** add design system usage scanner tool ([ec26f29](https://github.com/entur/design-system/commit/ec26f29213ddc97f7ee4a31b63cfb53b1d7c35b3))

  Adds a new scanner tool under tools/design-system-scanner that:

  - Scans Entur repos for @entur/\* package and component usage
  - Detects CSS variable overrides of design token properties
  - Resolves workspace monorepo structures via lockfile analysis
  - Exports structured data for BigQuery ingestion
  - Includes a component catalog (catalog.json) generated from package source

# 0.3.0 (2026-05-13)

### Bug Fixes

- **gha:** prevent PostHog event drops by batching flushes for large scans ([543cbda](https://github.com/entur/design-system/commit/543cbda5737129fee048d92f516083fde0f419c5))

  posthog-node defaults (flushAt=20, maxQueueSize=1000) cause silent event
  drops when scanning 85+ repos. Fix: raise queue limits, flush in batches
  of 500, and extend shutdown timeout to 60s.

### Features

- **root:** add design system usage scanner tool ([ec26f29](https://github.com/entur/design-system/commit/ec26f29213ddc97f7ee4a31b63cfb53b1d7c35b3))

  Adds a new scanner tool under tools/design-system-scanner that:

  - Scans Entur repos for @entur/\* package and component usage
  - Detects CSS variable overrides of design token properties
  - Resolves workspace monorepo structures via lockfile analysis
  - Exports structured data for BigQuery ingestion
  - Includes a component catalog (catalog.json) generated from package source
