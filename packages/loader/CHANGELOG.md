# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.8.5](https://github.com/entur/design-system/compare/@entur/loader@0.8.4...@entur/loader@0.8.5) (2026-09-08)

### Entur Dependency Updates

- **@entur/tokens:** `^4.1.0` → `^4.1.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#411-2026-09-08))
- **@entur/typography:** `^3.0.4` → `^3.0.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#305-2026-09-08))
- **@entur/utils:** `^0.15.0` → `^0.15.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0151-2026-09-08))

## [0.8.4](https://github.com/entur/design-system/compare/@entur/loader@0.8.3...@entur/loader@0.8.4) (2026-08-28)

### Entur Dependency Updates

- **@entur/tokens:** `^4.0.1` → `^4.1.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#410-2026-08-28))
- **@entur/typography:** `^3.0.3` → `^3.0.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#304-2026-08-28))

## [0.8.3](https://github.com/entur/design-system/compare/@entur/loader@0.8.2...@entur/loader@0.8.3) (2026-08-20)

### Entur Dependency Updates

- **@entur/typography:** `^3.0.2` → `^3.0.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#303-2026-08-20))

## [0.8.2](https://github.com/entur/design-system/compare/@entur/loader@0.8.1...@entur/loader@0.8.2) (2026-08-13)

### Entur Dependency Updates

- **@entur/typography:** `^3.0.1` → `^3.0.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#302-2026-08-13))
- **@entur/utils:** `^0.14.1` → `^0.15.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0150-2026-08-13))

## [0.8.1](https://github.com/entur/design-system/compare/@entur/loader@0.8.0...@entur/loader@0.8.1) (2026-08-06)

### Entur Dependency Updates

- **@entur/tokens:** `^4.0.0` → `^4.0.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#401-2026-08-06))
- **@entur/typography:** `^3.0.0` → `^3.0.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#301-2026-08-06))
- **@entur/utils:** `^0.14.0` → `^0.14.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0141-2026-08-06))

# [0.8.0](https://github.com/entur/design-system/compare/@entur/loader@0.7.4...@entur/loader@0.8.0) (2026-07-30)

### Bug Fixes

- **loader:** remove React.FC in favor of typed function parameters ([3ccbd6e](https://github.com/entur/design-system/commit/3ccbd6eb65c4babb6d9d7f60c57469d8a29d43e6))

  React.FC no longer provides implicit children typing in React 18.
  Move type annotations directly to function parameters.

### Features

- **loader:** add exports field for ESM-compatible module resolution ([f22bced](https://github.com/entur/design-system/commit/f22bced69505fe493ee032c858ae5413b37fb6e8))

  Consumers no longer need bundler aliases to resolve ESM entry points.
  Declares explicit exports map with entries for main entrypoint,
  ./styles (CSS), ./dist/styles.css (compat), and ./package.json.
  Deep dist/ imports not listed will stop resolving.

- **loader:** require React 18 as minimum peer dependency ([80ad49b](https://github.com/entur/design-system/commit/80ad49bdfaab3ed2497462810c6d9378055133fe))

### BREAKING CHANGES

- **loader:** undocumented deep imports into dist/ may break.
- **loader:** require React 18 as minimum peer dependency

## [0.7.4](https://github.com/entur/design-system/compare/@entur/loader@0.7.3...@entur/loader@0.7.4) (2026-07-03)

### Entur Dependency Updates

- **@entur/typography:** `^2.1.11` → `^2.1.12` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#2112-2026-07-03))
- **@entur/utils:** `^0.13.5` → `^0.13.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0136-2026-07-03))

## [0.7.3](https://github.com/entur/design-system/compare/@entur/loader@0.7.1...@entur/loader@0.7.3) (2026-06-22)

### Entur Dependency Updates

- **@entur/tokens:** `^3.23.0` → `^3.24.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3240-2026-06-22))
- **@entur/typography:** `^2.1.10` → `^2.1.11` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#2111-2026-06-22))

## [0.7.2](https://github.com/entur/design-system/compare/@entur/loader@0.7.1...@entur/loader@0.7.2) (2026-06-08)

### Entur Dependency Updates

- **@entur/typography:** `^2.1.9` → `^2.1.10` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#2110-2026-06-08))

## [0.7.1](https://github.com/entur/design-system/compare/@entur/loader@0.7.0...@entur/loader@0.7.1) (2026-06-08)

### Entur Dependency Updates

- **@entur/typography:** `^2.1.8` → `^2.1.9` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#219-2026-06-08))

# [0.7.0](https://github.com/entur/design-system/compare/@entur/loader@0.6.6...@entur/loader@0.7.0) (2026-06-05)

### Features

- **tokens:** update primitive, semantic, base and component color tokens ([3ef6220](https://github.com/entur/design-system/commit/3ef622059143f24dcf7c94b19d4b7337fbac3508))

  Updates primitive, semantic, base and component-level color tokens.
  Visual changes affect alert, datepicker, loader, menu, tab, and travel
  components.

## [0.6.7](https://github.com/entur/design-system/compare/@entur/loader@0.6.6...@entur/loader@0.6.7) (2026-05-13)

### Entur Dependency Updates

- **@entur/tokens:** `^3.22.3` → `^3.22.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3225-2026-05-13))
- **@entur/typography:** `^2.1.5` → `^2.1.7` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#217-2026-05-13))
- **@entur/utils:** `^0.13.2` → `^0.13.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0134-2026-05-13))

## [0.6.5](https://github.com/entur/design-system/compare/@entur/loader@0.6.4...@entur/loader@0.6.5) (2026-03-16)

### Entur Dependency Updates

- **@entur/tokens:** `^3.22.2` → `^3.22.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3223-2026-03-16))
- **@entur/typography:** `^2.1.4` → `^2.1.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#215-2026-03-16))
- **@entur/utils:** `^0.13.1` → `^0.13.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0132-2026-03-16))

## [0.6.4](https://github.com/entur/design-system/compare/@entur/loader@0.6.3...@entur/loader@0.6.4) (2026-02-20)

### Entur Dependency Updates

- **@entur/tokens:** `^3.22.1` → `^3.22.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3222-2026-02-20))
- **@entur/typography:** `^2.1.3` → `^2.1.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#214-2026-02-20))

## [0.6.3](https://github.com/entur/design-system/compare/@entur/loader@0.6.2...@entur/loader@0.6.3) (2026-01-28)

### Entur Dependency Updates

- **@entur/tokens:** `^3.22.0` → `^3.22.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3221-2026-01-28))
- **@entur/typography:** `^2.1.2` → `^2.1.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#213-2026-01-28))

## [0.6.2](https://github.com/entur/design-system/compare/@entur/loader@0.6.1...@entur/loader@0.6.2) (2026-01-23)

### Entur Dependency Updates

- **@entur/tokens:** `^3.21.0` → `^3.22.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3220-2026-01-23))
- **@entur/typography:** `^2.1.0` → `^2.1.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#212-2026-01-23))
- **@entur/utils:** `^0.13.0` → `^0.13.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md))

# [0.6.0](https://github.com/entur/design-system/compare/@entur/loader@0.5.36...@entur/loader@0.6.0) (2025-12-05)

### Features

- add new component size css variables to all relevant packages ([aceafa8](https://github.com/entur/design-system/commit/aceafa85c8da121ad0654fb08caad22257c16bc9))

## [0.5.36](https://github.com/entur/design-system/compare/@entur/loader@0.5.35...@entur/loader@0.5.36) (2025-11-24)

### Bug Fixes

- remove unneccesary vendor prefixes from source scss files ([14fe64e](https://github.com/entur/design-system/commit/14fe64eac51ae7756ea096cdc2c3b1e8bc1cb921))

  Vendor prefixas are now added via PostCSS instead

## [0.5.35](https://github.com/entur/design-system/compare/@entur/loader@0.5.34...@entur/loader@0.5.35) (2025-10-20)

### Entur Dependency Updates

- **@entur/typography:** `^2.0.2` → `^2.0.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#203-2025-10-20))

## [0.5.34](https://github.com/entur/design-system/compare/@entur/loader@0.5.33...@entur/loader@0.5.34) (2025-10-17)

### Entur Dependency Updates

- **@entur/typography:** `^2.0.1` → `^2.0.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#202-2025-10-17))

## [0.5.33](https://github.com/entur/design-system/compare/@entur/loader@0.5.32...@entur/loader@0.5.33) (2025-09-30)

### Entur Dependency Updates

- **@entur/tokens:** `^3.19.3` → `^3.20.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3200-2025-09-30))
- **@entur/typography:** `^2.0.0` → `^2.0.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#201-2025-09-30))

## [0.5.32](https://github.com/entur/design-system/compare/@entur/loader@0.5.31...@entur/loader@0.5.32) (2025-09-24)

### Entur Dependency Updates

- **@entur/tokens:** `^3.19.2` → `^3.19.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md))
- **@entur/typography:** `^1.9.13` → `^2.0.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#200-2025-09-24))
- **@entur/utils:** `^0.12.4` → `^0.12.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md))

## [0.5.30](https://github.com/entur/design-system/compare/@entur/loader@0.5.29...@entur/loader@0.5.30) (2025-08-29)

### Bug Fixes

- **deps:** bump minor for dependencies ([bdde8f2](https://github.com/entur/design-system/commit/bdde8f2d5ab46cfa307a424429063b9700edfc1e))

  classnames, react-focus-lock, @react-aria, @react-stately, @internationalized/date, react-dropzone

- exclude dependencies from bundle ([5252a14](https://github.com/entur/design-system/commit/5252a14c4c615452f3cc7effc73287a5ee42399e))
- fix package.json field order ([7de85f2](https://github.com/entur/design-system/commit/7de85f2baf08a1fc3a0223e3f149c8cf9636546b))

  incorrect order made types unavailable

## [0.5.29](https://github.com/entur/design-system/compare/@entur/loader@0.5.28...@entur/loader@0.5.29) (2025-06-27)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.11` → `^1.9.12` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#1912-2025-06-27))

## [0.5.28](https://github.com/entur/design-system/compare/@entur/loader@0.5.27...@entur/loader@0.5.28) (2025-06-17)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.10` → `^1.9.11` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#1911-2025-06-17))

## [0.5.27](https://github.com/entur/design-system/compare/@entur/loader@0.5.27-beta.0...@entur/loader@0.5.27) (2025-06-06)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.10-beta.0` → `^1.9.10` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#1910-2025-06-06))

## [0.5.27-beta.0](https://github.com/entur/design-system/compare/@entur/loader@0.5.26...@entur/loader@0.5.27-beta.0) (2025-06-06)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.9` → `^1.9.10-beta.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#1910-beta0-2025-06-06))

## [0.5.26](https://github.com/entur/design-system/compare/@entur/loader@0.5.25...@entur/loader@0.5.26) (2025-05-22)

### Entur Dependency Updates

- **@entur/tokens:** `^3.19.0` → `^3.19.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3191-2025-05-22))
- **@entur/typography:** `^1.9.8` → `^1.9.9` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#199-2025-05-22))

## [0.5.25](https://github.com/entur/design-system/compare/@entur/loader@0.5.24...@entur/loader@0.5.25) (2025-04-29)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.7` → `^1.9.8` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#198-2025-04-29))

## [0.5.24](https://github.com/entur/design-system/compare/@entur/loader@0.5.23...@entur/loader@0.5.24) (2025-04-29)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.6` → `^1.9.7` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#197-2025-04-29))

## [0.5.23](https://github.com/entur/design-system/compare/@entur/loader@0.5.22...@entur/loader@0.5.23) (2025-04-23)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.5` → `^1.9.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#196-2025-04-23))

## [0.5.22](https://github.com/entur/design-system/compare/@entur/loader@0.5.21...@entur/loader@0.5.22) (2025-04-11)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.4` → `^1.9.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#195-2025-04-11))

## [0.5.21](https://github.com/entur/design-system/compare/@entur/loader@0.5.20...@entur/loader@0.5.21) (2025-03-24)

### Entur Dependency Updates

- **@entur/tokens:** `^3.18.0` → `^3.19.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3190-2025-03-24))
- **@entur/typography:** `^1.9.3` → `^1.9.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#194-2025-03-24))
- **@entur/utils:** `^0.12.2` → `^0.12.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0123-2025-03-24))

## [0.5.20](https://github.com/entur/design-system/compare/@entur/loader@0.5.19...@entur/loader@0.5.20) (2025-03-05)

### Entur Dependency Updates

- **@entur/tokens:** `^3.17.6` → `^3.18.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3180-2025-03-05))
- **@entur/typography:** `^1.9.2` → `^1.9.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#193-2025-03-05))

## [0.5.19](https://github.com/entur/design-system/compare/@entur/loader@0.5.18...@entur/loader@0.5.19) (2025-02-25)

### Entur Dependency Updates

- **@entur/typography:** `^1.9.1` → `^1.9.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#192-2025-02-25))

## [0.5.18](https://github.com/entur/design-system/compare/@entur/loader@0.5.17...@entur/loader@0.5.18) (2025-02-20)

### Entur Dependency Updates

- **@entur/tokens:** `^3.17.5` → `^3.17.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3176-2025-02-20))
- **@entur/typography:** `^1.9.0` → `^1.9.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#191-2025-02-20))

## [0.5.17](https://github.com/entur/design-system/compare/@entur/loader@0.5.16...@entur/loader@0.5.17) (2025-01-24)

### Entur Dependency Updates

- **@entur/typography:** `^1.8.51` → `^1.9.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#190-2025-01-24))

## [0.5.16](https://github.com/entur/design-system/compare/@entur/loader@0.5.15...@entur/loader@0.5.16) (2025-01-15)

### Entur Dependency Updates

- **@entur/tokens:** `^3.17.4` → `^3.17.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3175-2025-01-15))
- **@entur/typography:** `^1.8.50` → `^1.8.51` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#1851-2025-01-15))

## [0.5.15](https://github.com/entur/design-system/compare/@entur/loader@0.5.15-RC.0...@entur/loader@0.5.15) (2025-01-14)

### Entur Dependency Updates

- **@entur/tokens:** `^3.17.4-RC.0` → `^3.17.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3174-2025-01-14))
- **@entur/typography:** `^1.8.50-RC.0` → `^1.8.50` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#1850-2025-01-14))
- **@entur/utils:** `^0.12.2-RC.0` → `^0.12.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0122-2025-01-14))

## [0.5.15-RC.0](https://github.com/entur/design-system/compare/@entur/loader@0.5.14...@entur/loader@0.5.15-RC.0) (2025-01-09)

### Entur Dependency Updates

- **@entur/tokens:** `^3.17.3` → `^3.17.4-RC.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3174-rc0-2025-01-09))
- **@entur/typography:** `^1.8.49` → `^1.8.50-RC.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/typography/CHANGELOG.md#1850-rc0-2025-01-09))
- **@entur/utils:** `^0.12.1` → `^0.12.2-RC.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0122-rc0-2025-01-09))

## [0.5.14](https://github.com/entur/design-system/compare/@entur/loader@0.5.13...@entur/loader@0.5.14) (2024-11-20)

**Note:** Version bump only for package @entur/loader

## [0.5.13](https://github.com/entur/design-system/compare/@entur/loader@0.5.12...@entur/loader@0.5.13) (2024-11-12)

**Note:** Version bump only for package @entur/loader

## [0.5.12](https://github.com/entur/design-system/compare/@entur/loader@0.5.11...@entur/loader@0.5.12) (2024-10-23)

### Bug Fixes

- **tokens:** add [@forward](https://bitbucket.org/forward) export in scss stylesheets that import scss variabels ([7141592](https://github.com/entur/design-system/commits/71415926888eda23e02efaf98a611043f9fd9b2f))

## [0.5.11](https://github.com/entur/design-system/compare/@entur/loader@0.5.10...@entur/loader@0.5.11) (2024-10-03)

**Note:** Version bump only for package @entur/loader

## [0.5.10](https://github.com/entur/design-system/compare/@entur/loader@0.5.9...@entur/loader@0.5.10) (2024-09-19)

**Note:** Version bump only for package @entur/loader

## [0.5.9](https://github.com/entur/design-system/compare/@entur/loader@0.5.8...@entur/loader@0.5.9) (2024-09-10)

**Note:** Version bump only for package @entur/loader

## [0.5.8](https://github.com/entur/design-system/compare/@entur/loader@0.5.7...@entur/loader@0.5.8) (2024-08-28)

**Note:** Version bump only for package @entur/loader

## [0.5.7](https://github.com/entur/design-system/compare/@entur/loader@0.5.6...@entur/loader@0.5.7) (2024-08-12)

**Note:** Version bump only for package @entur/loader

## [0.5.6](https://github.com/entur/design-system/compare/@entur/loader@0.5.5...@entur/loader@0.5.6) (2024-07-11)

**Note:** Version bump only for package @entur/loader

## [0.5.5](https://github.com/entur/design-system/compare/@entur/loader@0.5.4...@entur/loader@0.5.5) (2024-07-11)

**Note:** Version bump only for package @entur/loader

## [0.5.4](https://github.com/entur/design-system/compare/@entur/loader@0.5.3...@entur/loader@0.5.4) (2024-06-11)

**Note:** Version bump only for package @entur/loader

## [0.5.3](https://github.com/entur/design-system/compare/@entur/loader@0.5.2...@entur/loader@0.5.3) (2024-05-29)

**Note:** Version bump only for package @entur/loader

## [0.5.2](https://github.com/entur/design-system/compare/@entur/loader@0.5.1...@entur/loader@0.5.2) (2024-05-21)

**Note:** Version bump only for package @entur/loader

## [0.5.1](https://github.com/entur/design-system/compare/@entur/loader@0.5.0...@entur/loader@0.5.1) (2024-05-13)

**Note:** Version bump only for package @entur/loader

# [0.5.0](https://github.com/entur/design-system/compare/@entur/loader@0.4.65...@entur/loader@0.5.0) (2024-05-07)

### Features

- **loader:** added new spinner, first version ([681cbce](https://github.com/entur/design-system/commits/681cbce2ef55a1ddcee747cf99e55be66ec23b24))

## [0.4.65](https://github.com/entur/design-system/compare/@entur/loader@0.4.64...@entur/loader@0.4.65) (2024-04-24)

**Note:** Version bump only for package @entur/loader

## [0.4.64](https://github.com/entur/design-system/compare/@entur/loader@0.4.63...@entur/loader@0.4.64) (2024-04-22)

**Note:** Version bump only for package @entur/loader

## [0.4.63](https://github.com/entur/design-system/compare/@entur/loader@0.4.62...@entur/loader@0.4.63) (2024-04-18)

**Note:** Version bump only for package @entur/loader

## [0.4.62](https://github.com/entur/design-system/compare/@entur/loader@0.4.61...@entur/loader@0.4.62) (2024-04-18)

**Note:** Version bump only for package @entur/loader

## [0.4.61](https://github.com/entur/design-system/compare/@entur/loader@0.4.60...@entur/loader@0.4.61) (2024-04-12)

**Note:** Version bump only for package @entur/loader

## [0.4.60](https://github.com/entur/design-system/compare/@entur/loader@0.4.59...@entur/loader@0.4.60) (2024-04-11)

**Note:** Version bump only for package @entur/loader

## [0.4.59](https://github.com/entur/design-system/compare/@entur/loader@0.4.58...@entur/loader@0.4.59) (2024-04-10)

### Bug Fixes

- migrate away from legacy tilde imports in sass ([cc16e7f](https://github.com/entur/design-system/commits/cc16e7f1a8d65143ab0dd583aea76b5ba11be148))

## [0.4.58](https://github.com/entur/design-system/compare/@entur/loader@0.4.57...@entur/loader@0.4.58) (2024-03-27)

**Note:** Version bump only for package @entur/loader

## [0.4.57](https://github.com/entur/design-system/compare/@entur/loader@0.4.56...@entur/loader@0.4.57) (2024-03-25)

**Note:** Version bump only for package @entur/loader

## [0.4.56](https://github.com/entur/design-system/compare/@entur/loader@0.4.55...@entur/loader@0.4.56) (2024-03-21)

**Note:** Version bump only for package @entur/loader

## [0.4.55](https://github.com/entur/design-system/compare/@entur/loader@0.4.54...@entur/loader@0.4.55) (2024-03-06)

**Note:** Version bump only for package @entur/loader

## [0.4.54](https://github.com/entur/design-system/compare/@entur/loader@0.4.53...@entur/loader@0.4.54) (2024-02-12)

**Note:** Version bump only for package @entur/loader

## [0.4.53](https://github.com/entur/design-system/compare/@entur/loader@0.4.52...@entur/loader@0.4.53) (2024-02-01)

**Note:** Version bump only for package @entur/loader

## [0.4.52](https://github.com/entur/design-system/compare/@entur/loader@0.4.51...@entur/loader@0.4.52) (2024-01-24)

**Note:** Version bump only for package @entur/loader

## [0.4.51](https://github.com/entur/design-system/compare/@entur/loader@0.4.50...@entur/loader@0.4.51) (2023-12-22)

**Note:** Version bump only for package @entur/loader

## [0.4.50](https://github.com/entur/design-system/compare/@entur/loader@0.4.49...@entur/loader@0.4.50) (2023-12-18)

**Note:** Version bump only for package @entur/loader

## [0.4.49](https://github.com/entur/design-system/compare/@entur/loader@0.4.48...@entur/loader@0.4.49) (2023-12-11)

**Note:** Version bump only for package @entur/loader

## [0.4.47](https://github.com/entur/design-system/compare/@entur/loader@0.4.46...@entur/loader@0.4.47) (2023-10-30)

**Note:** Version bump only for package @entur/loader

## [0.4.46](https://github.com/entur/design-system/compare/@entur/loader@0.4.45...@entur/loader@0.4.46) (2023-10-23)

**Note:** Version bump only for package @entur/loader

## [0.4.45](https://github.com/entur/design-system/compare/@entur/loader@0.4.44...@entur/loader@0.4.45) (2023-10-11)

**Note:** Version bump only for package @entur/loader

## [0.4.44](https://github.com/entur/design-system/compare/@entur/loader@0.4.43...@entur/loader@0.4.44) (2023-10-11)

**Note:** Version bump only for package @entur/loader

## [0.4.43](https://github.com/entur/design-system/compare/@entur/loader@0.4.42...@entur/loader@0.4.43) (2023-10-06)

**Note:** Version bump only for package @entur/loader

## [0.4.42](https://github.com/entur/design-system/compare/@entur/loader@0.4.41...@entur/loader@0.4.42) (2023-10-06)

**Note:** Version bump only for package @entur/loader

## [0.4.41](https://github.com/entur/design-system/compare/@entur/loader@0.4.39...@entur/loader@0.4.41) (2023-09-25)

**Note:** Version bump only for package @entur/loader

## [0.4.40](https://github.com/entur/design-system/compare/@entur/loader@0.4.39...@entur/loader@0.4.40) (2023-09-25)

**Note:** Version bump only for package @entur/loader

## [0.4.39](https://github.com/entur/design-system/compare/@entur/loader@0.4.38...@entur/loader@0.4.39) (2023-09-08)

**Note:** Version bump only for package @entur/loader

## [0.4.38](https://github.com/entur/design-system/compare/@entur/loader@0.4.37...@entur/loader@0.4.38) (2023-08-28)

**Note:** Version bump only for package @entur/loader

## [0.4.36](https://github.com/entur/design-system/compare/@entur/loader@0.4.35...@entur/loader@0.4.36) (2023-08-10)

**Note:** Version bump only for package @entur/loader

## [0.4.35](https://github.com/entur/design-system/compare/@entur/loader@0.4.34...@entur/loader@0.4.35) (2023-08-09)

**Note:** Version bump only for package @entur/loader

## [0.4.34](https://github.com/entur/design-system/compare/@entur/loader@0.4.33...@entur/loader@0.4.34) (2023-07-19)

**Note:** Version bump only for package @entur/loader

## [0.4.33](https://github.com/entur/design-system/compare/@entur/loader@0.4.32...@entur/loader@0.4.33) (2023-07-19)

**Note:** Version bump only for package @entur/loader

## [0.4.32](https://github.com/entur/design-system/compare/@entur/loader@0.4.31...@entur/loader@0.4.32) (2023-07-18)

**Note:** Version bump only for package @entur/loader

## [0.4.31](https://github.com/entur/design-system/compare/@entur/loader@0.4.30...@entur/loader@0.4.31) (2023-05-11)

**Note:** Version bump only for package @entur/loader

## [0.4.30](https://github.com/entur/design-system/compare/@entur/loader@0.4.29...@entur/loader@0.4.30) (2023-04-21)

**Note:** Version bump only for package @entur/loader

## [0.4.29](https://github.com/entur/design-system/compare/@entur/loader@0.4.28...@entur/loader@0.4.29) (2023-04-17)

### Bug Fixes

- **skeleton:** add loading message for screen readers to skeleton wrapper ([b69cb47](https://github.com/entur/design-system/commits/b69cb47526d6531c6926e153c3cb8a45d1caf63d))

## [0.4.28](https://github.com/entur/design-system/compare/@entur/loader@0.4.25...@entur/loader@0.4.28) (2023-04-13)

**Note:** Version bump only for package @entur/loader

## [0.4.27](https://github.com/entur/design-system/compare/@entur/loader@0.4.25...@entur/loader@0.4.27) (2023-04-05)

**Note:** Version bump only for package @entur/loader

## [0.4.26](https://github.com/entur/design-system/compare/@entur/loader@0.4.25...@entur/loader@0.4.26) (2023-04-04)

**Note:** Version bump only for package @entur/loader

## [0.4.25](https://github.com/entur/design-system/compare/@entur/loader@0.4.24...@entur/loader@0.4.25) (2023-03-27)

**Note:** Version bump only for package @entur/loader

## [0.4.24](https://github.com/entur/design-system/compare/@entur/loader@0.4.23...@entur/loader@0.4.24) (2023-03-13)

**Note:** Version bump only for package @entur/loader

## [0.4.23](https://github.com/entur/design-system/compare/@entur/loader@0.4.22...@entur/loader@0.4.23) (2023-03-03)

**Note:** Version bump only for package @entur/loader

## [0.4.22](https://github.com/entur/design-system/compare/@entur/loader@0.4.18...@entur/loader@0.4.22) (2023-02-17)

**Note:** Version bump only for package @entur/loader

## [0.4.21](https://github.com/entur/design-system/compare/@entur/loader@0.4.18...@entur/loader@0.4.21) (2023-02-15)

**Note:** Version bump only for package @entur/loader

## [0.4.20](https://github.com/entur/design-system/compare/@entur/loader@0.4.18...@entur/loader@0.4.20) (2023-02-15)

**Note:** Version bump only for package @entur/loader

## [0.4.19](https://github.com/entur/design-system/compare/@entur/loader@0.4.18...@entur/loader@0.4.19) (2023-02-09)

**Note:** Version bump only for package @entur/loader

## [0.4.18](https://github.com/entur/design-system/compare/@entur/loader@0.4.17...@entur/loader@0.4.18) (2023-02-02)

**Note:** Version bump only for package @entur/loader

## [0.4.16](https://github.com/entur/design-system/compare/@entur/loader@0.4.15...@entur/loader@0.4.16) (2023-01-19)

**Note:** Version bump only for package @entur/loader

## [0.4.15](https://github.com/entur/design-system/compare/@entur/loader@0.4.12...@entur/loader@0.4.15) (2022-12-09)

**Note:** Version bump only for package @entur/loader

## [0.4.14](https://github.com/entur/design-system/compare/@entur/loader@0.4.13...@entur/loader@0.4.14) (2022-11-24)

**Note:** Version bump only for package @entur/loader

## [0.4.13](https://github.com/entur/design-system/compare/@entur/loader@0.4.12...@entur/loader@0.4.13) (2022-10-31)

**Note:** Version bump only for package @entur/loader

## [0.4.11](https://github.com/entur/design-system/compare/@entur/loader@0.4.10...@entur/loader@0.4.11) (2022-08-31)

**Note:** Version bump only for package @entur/loader

## [0.4.10](https://github.com/entur/design-system/compare/@entur/loader@0.4.9...@entur/loader@0.4.10) (2022-08-24)

**Note:** Version bump only for package @entur/loader

## [0.4.9](https://github.com/entur/design-system/compare/@entur/loader@0.4.8...@entur/loader@0.4.9) (2022-08-09)

**Note:** Version bump only for package @entur/loader

## [0.4.8](https://github.com/entur/design-system/compare/@entur/loader@0.4.7...@entur/loader@0.4.8) (2022-06-02)

**Note:** Version bump only for package @entur/loader

## [0.4.7](https://github.com/entur/design-system/compare/@entur/loader@0.4.6...@entur/loader@0.4.7) (2022-05-13)

**Note:** Version bump only for package @entur/loader

## [0.4.6](https://github.com/entur/design-system/compare/@entur/loader@0.4.5...@entur/loader@0.4.6) (2022-04-27)

**Note:** Version bump only for package @entur/loader

## [0.4.5](https://github.com/entur/design-system/compare/@entur/loader@0.4.4...@entur/loader@0.4.5) (2022-02-09)

**Note:** Version bump only for package @entur/loader

## [0.4.4](https://github.com/entur/design-system/compare/@entur/loader@0.4.3...@entur/loader@0.4.4) (2021-11-17)

**Note:** Version bump only for package @entur/loader

## [0.4.3](https://github.com/entur/design-system/compare/@entur/loader@0.4.2...@entur/loader@0.4.3) (2021-09-23)

**Note:** Version bump only for package @entur/loader

## [0.4.2](https://github.com/entur/design-system/compare/@entur/loader@0.4.1...@entur/loader@0.4.2) (2021-09-07)

**Note:** Version bump only for package @entur/loader

## [0.4.1](https://github.com/entur/design-system/compare/@entur/loader@0.4.0...@entur/loader@0.4.1) (2021-06-25)

### Bug Fixes

- update dependencies ([3993f1c](https://github.com/entur/design-system/commits/3993f1c11fa67305e99bedd04f72d835703ab745))

# [0.4.0](https://github.com/entur/design-system/compare/@entur/loader@0.3.37...@entur/loader@0.4.0) (2021-04-23)

### Bug Fixes

- **loadingdots:** improve typing of component ([1e5bd44](https://github.com/entur/design-system/commits/1e5bd44b0c923ced3af82f7f425f95ba0572eee2))

### Features

- **loadingdots:** add new component loading dots ([0fc4d9a](https://github.com/entur/design-system/commits/0fc4d9a7bffa5ef3bd711385bb5bd6d09402185a))

## [0.3.37](https://github.com/entur/design-system/compare/@entur/loader@0.3.36...@entur/loader@0.3.37) (2021-03-02)

**Note:** Version bump only for package @entur/loader

## [0.3.36](https://github.com/entur/design-system/compare/@entur/loader@0.3.35...@entur/loader@0.3.36) (2021-02-17)

**Note:** Version bump only for package @entur/loader

## [0.3.35](https://github.com/entur/design-system/compare/@entur/loader@0.3.34...@entur/loader@0.3.35) (2021-01-20)

**Note:** Version bump only for package @entur/loader

## [0.3.34](https://github.com/entur/design-system/compare/@entur/loader@0.3.33...@entur/loader@0.3.34) (2021-01-13)

### Bug Fixes

- transpose grey colors for updated color tokens ([d6a444c](https://github.com/entur/design-system/commits/d6a444c2c37339b9bac0702738ed52693367d344))

## [0.3.33](https://github.com/entur/design-system/compare/@entur/loader@0.3.32...@entur/loader@0.3.33) (2021-01-05)

**Note:** Version bump only for package @entur/loader

## [0.3.32](https://github.com/entur/design-system/compare/@entur/loader@0.3.31...@entur/loader@0.3.32) (2020-12-04)

**Note:** Version bump only for package @entur/loader

## [0.3.31](https://github.com/entur/design-system/compare/@entur/loader@0.3.30...@entur/loader@0.3.31) (2020-11-05)

### Bug Fixes

- **baseskeleton:** declare style as a required prop ([fd58ebd](https://github.com/entur/design-system/commits/fd58ebda5987c3c0b92282942c16325159e71fc7))
- **skeletoncircle:** improve typings for size prop ([be80713](https://github.com/entur/design-system/commits/be8071346a55b9311c2dcdfd5141ae6c13f3619e))
- **skeletonrectangle:** improve typings for props width and height ([3c92baa](https://github.com/entur/design-system/commits/3c92baa2e6b8c55227bc6db974a736f53d33a595))

## [0.3.30](https://github.com/entur/design-system/compare/@entur/loader@0.3.29...@entur/loader@0.3.30) (2020-10-23)

**Note:** Version bump only for package @entur/loader

## [0.3.29](https://github.com/entur/design-system/compare/@entur/loader@0.3.28...@entur/loader@0.3.29) (2020-10-16)

### Bug Fixes

- **loader:** set loader label as div with h5 styling ([7395638](https://github.com/entur/design-system/commits/73956385b5bdfca5f7c0a2ebf46bb4a13b3c0722))

## [0.3.28](https://github.com/entur/design-system/compare/@entur/loader@0.3.27...@entur/loader@0.3.28) (2020-10-09)

**Note:** Version bump only for package @entur/loader

## [0.3.27](https://github.com/entur/design-system/compare/@entur/loader@0.3.26...@entur/loader@0.3.27) (2020-09-14)

**Note:** Version bump only for package @entur/loader

## [0.3.26](https://github.com/entur/design-system/compare/@entur/loader@0.3.25...@entur/loader@0.3.26) (2020-09-10)

### Bug Fixes

- **loader:** adjust heading type for loader ([f52ae85](https://github.com/entur/design-system/commits/f52ae8552c4ef0ddcb9a969b6ae5e821fa785487))

## [0.3.25](https://github.com/entur/design-system/compare/@entur/loader@0.3.24...@entur/loader@0.3.25) (2020-09-02)

**Note:** Version bump only for package @entur/loader

## [0.3.24](https://github.com/entur/design-system/compare/@entur/loader@0.3.23...@entur/loader@0.3.24) (2020-08-19)

**Note:** Version bump only for package @entur/loader

## [0.3.23](https://github.com/entur/design-system/compare/@entur/loader@0.3.22...@entur/loader@0.3.23) (2020-08-11)

**Note:** Version bump only for package @entur/loader

## [0.3.22](https://github.com/entur/design-system/compare/@entur/loader@0.3.21...@entur/loader@0.3.22) (2020-07-03)

**Note:** Version bump only for package @entur/loader

## [0.3.21](https://github.com/entur/design-system/compare/@entur/loader@0.3.20...@entur/loader@0.3.21) (2020-06-17)

**Note:** Version bump only for package @entur/loader

## [0.3.20](https://github.com/entur/design-system/compare/@entur/loader@0.3.19...@entur/loader@0.3.20) (2020-05-27)

**Note:** Version bump only for package @entur/loader

## [0.3.19](https://github.com/entur/design-system/compare/@entur/loader@0.3.18...@entur/loader@0.3.19) (2020-05-26)

**Note:** Version bump only for package @entur/loader

## [0.3.18](https://github.com/entur/design-system/compare/@entur/loader@0.3.17...@entur/loader@0.3.18) (2020-05-20)

### Bug Fixes

- add namespace to back-and-forth keyframe ([b6abe6a](https://github.com/entur/design-system/commits/b6abe6abf65cce851bfca176c4497b9c8fa8cb27))

## [0.3.17](https://github.com/entur/design-system/compare/@entur/loader@0.3.16...@entur/loader@0.3.17) (2020-04-27)

**Note:** Version bump only for package @entur/loader

## [0.3.16](https://github.com/entur/design-system/compare/@entur/loader@0.3.15...@entur/loader@0.3.16) (2020-04-23)

**Note:** Version bump only for package @entur/loader

## [0.3.15](https://github.com/entur/design-system/compare/@entur/loader@0.3.14...@entur/loader@0.3.15) (2020-03-20)

**Note:** Version bump only for package @entur/loader

## [0.3.14](https://github.com/entur/design-system/compare/@entur/loader@0.3.13...@entur/loader@0.3.14) (2020-03-18)

**Note:** Version bump only for package @entur/loader

## [0.3.13](https://github.com/entur/design-system/compare/@entur/loader@0.3.12...@entur/loader@0.3.13) (2020-02-20)

**Note:** Version bump only for package @entur/loader

## [0.3.12](https://github.com/entur/design-system/compare/@entur/loader@0.3.11...@entur/loader@0.3.12) (2020-02-14)

**Note:** Version bump only for package @entur/loader

## [0.3.11](https://github.com/entur/design-system/compare/@entur/loader@0.3.10...@entur/loader@0.3.11) (2020-02-10)

**Note:** Version bump only for package @entur/loader

## [0.3.10](https://github.com/entur/design-system/compare/@entur/loader@0.3.9...@entur/loader@0.3.10) (2020-02-05)

### Bug Fixes

- remove test-files from build process ([e0b24af](https://github.com/entur/design-system/commits/e0b24af05d5c2ad8de4ae587d83c389495235890))

## [0.3.9](https://github.com/entur/design-system/compare/@entur/loader@0.3.8...@entur/loader@0.3.9) (2020-01-28)

**Note:** Version bump only for package @entur/loader

## [0.3.8](https://github.com/entur/design-system/compare/@entur/loader@0.3.7...@entur/loader@0.3.8) (2020-01-27)

### Bug Fixes

- adding percentage number and adjusting typography ([87f32a9](https://github.com/entur/design-system/commits/87f32a9f7670ce93fa86c118e5a814b769e88cff))
- **types:** place types in the correct place ([acace09](https://github.com/entur/design-system/commits/acace09ec0e258c5cff3a65e13ab29d6603780d9))

## [0.3.7](https://github.com/entur/design-system/compare/@entur/loader@0.3.6...@entur/loader@0.3.7) (2020-01-20)

**Note:** Version bump only for package @entur/loader

## [0.3.6](https://github.com/entur/design-system/compare/@entur/loader@0.3.5...@entur/loader@0.3.6) (2020-01-14)

**Note:** Version bump only for package @entur/loader

## [0.3.5](https://github.com/entur/design-system/compare/@entur/loader@0.3.4...@entur/loader@0.3.5) (2020-01-13)

**Note:** Version bump only for package @entur/loader

## [0.3.4](https://github.com/entur/design-system/compare/@entur/loader@0.3.3...@entur/loader@0.3.4) (2020-01-08)

### Bug Fixes

- warn in development if the developer have forgotten the CSS ([e5c30fc](https://github.com/entur/design-system/commits/e5c30fc08624ef22c02773892778abd92205c6b0))

## [0.3.3](https://github.com/entur/design-system/compare/@entur/loader@0.3.2...@entur/loader@0.3.3) (2020-01-06)

**Note:** Version bump only for package @entur/loader

## [0.3.2](https://github.com/entur/design-system/compare/@entur/loader@0.3.1...@entur/loader@0.3.2) (2019-12-10)

### Bug Fixes

- adding default prop as part of documentation ([1ef7510](https://github.com/entur/design-system/commits/1ef75107362f6262429d7fe31519b4353eccc8de))

## [0.3.1](https://github.com/entur/design-system/compare/@entur/loader@0.3.0...@entur/loader@0.3.1) (2019-11-29)

**Note:** Version bump only for package @entur/loader

# [0.3.0](https://github.com/entur/design-system/compare/@entur/loader@0.2.3...@entur/loader@0.3.0) (2019-11-22)

### Bug Fixes

- fixing potential duplication of props naming ([6efd896](https://github.com/entur/design-system/commits/6efd896d381bca09bc047dbdaec6d2629a9571db))

### Features

- **types:** exporting all public types for public components ([4a277ab](https://github.com/entur/design-system/commits/4a277ab266fdb32a6760821a07b1c6cc716bac85))
- adding the skeleton components ([e669345](https://github.com/entur/design-system/commits/e6693452a20c6b3e44642113b6d08a72c1b100ea))

## [0.2.3](https://github.com/entur/design-system/compare/@entur/loader@0.2.2...@entur/loader@0.2.3) (2019-11-18)

**Note:** Version bump only for package @entur/loader

## [0.2.2](https://github.com/entur/design-system/compare/@entur/loader@0.2.1...@entur/loader@0.2.2) (2019-11-14)

### Bug Fixes

- **css classnames:** fixing naming collisions with CSS classes ([a93ca43](https://github.com/entur/design-system/commits/a93ca435d3a01d61d8f02694a672686b9e943a66))

## [0.2.1](https://github.com/entur/design-system/compare/@entur/loader@0.2.0...@entur/loader@0.2.1) (2019-11-07)

**Note:** Version bump only for package @entur/loader

# 0.2.0 (2019-11-06)

### Features

- **loaders:** add new package - @entur/loader ([a0811ae](https://github.com/entur/design-system/commits/a0811aee2f1ba713a7190c9fa9fd84cdcd2a6d90))
