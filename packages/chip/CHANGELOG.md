# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.11.5](https://github.com/entur/design-system/compare/@entur/chip@0.11.4...@entur/chip@0.11.5) (2026-09-08)

### Entur Dependency Updates

- **@entur/form:** `^10.1.1` → `^10.1.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#1012-2026-09-08))
- **@entur/icons:** `^10.0.3` → `^10.0.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#1004-2026-09-08))
- **@entur/loader:** `^0.8.4` → `^0.8.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#085-2026-09-08))
- **@entur/tokens:** `^4.1.0` → `^4.1.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#411-2026-09-08))
- **@entur/utils:** `^0.15.0` → `^0.15.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0151-2026-09-08))

## [0.11.4](https://github.com/entur/design-system/compare/@entur/chip@0.11.3...@entur/chip@0.11.4) (2026-08-28)

### Entur Dependency Updates

- **@entur/form:** `^10.1.0` → `^10.1.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#1011-2026-08-28))
- **@entur/icons:** `^10.0.2` → `^10.0.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#1003-2026-08-28))
- **@entur/loader:** `^0.8.3` → `^0.8.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#084-2026-08-28))
- **@entur/tokens:** `^4.0.1` → `^4.1.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#410-2026-08-28))

## [0.11.3](https://github.com/entur/design-system/compare/@entur/chip@0.11.2...@entur/chip@0.11.3) (2026-08-20)

### Entur Dependency Updates

- **@entur/form:** `^10.0.2` → `^10.1.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#1010-2026-08-20))
- **@entur/icons:** `^10.0.1` → `^10.0.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#1002-2026-08-20))
- **@entur/loader:** `^0.8.2` → `^0.8.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#083-2026-08-20))

## [0.11.2](https://github.com/entur/design-system/compare/@entur/chip@0.11.1...@entur/chip@0.11.2) (2026-08-13)

### Entur Dependency Updates

- **@entur/form:** `^10.0.1` → `^10.0.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#1002-2026-08-13))
- **@entur/loader:** `^0.8.1` → `^0.8.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#082-2026-08-13))
- **@entur/utils:** `^0.14.1` → `^0.15.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0150-2026-08-13))

## [0.11.1](https://github.com/entur/design-system/compare/@entur/chip@0.11.0...@entur/chip@0.11.1) (2026-08-06)

### Entur Dependency Updates

- **@entur/form:** `^10.0.0` → `^10.0.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#1001-2026-08-06))
- **@entur/icons:** `^10.0.0` → `^10.0.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#1001-2026-08-06))
- **@entur/loader:** `^0.8.0` → `^0.8.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#081-2026-08-06))
- **@entur/tokens:** `^4.0.0` → `^4.0.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#401-2026-08-06))
- **@entur/utils:** `^0.14.0` → `^0.14.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0141-2026-08-06))

# [0.11.0](https://github.com/entur/design-system/compare/@entur/chip@0.10.16...@entur/chip@0.11.0) (2026-07-30)

### Bug Fixes

- **chip:** remove React.FC in favor of typed function parameters ([bd269e3](https://github.com/entur/design-system/commit/bd269e3b5497bbcb814390d35effe84b273a16e7))

  React.FC no longer provides implicit children typing in React 18.
  Move type annotations directly to function parameters.

### Features

- **chip:** add exports field for ESM-compatible module resolution ([9234e1c](https://github.com/entur/design-system/commit/9234e1c9acbd447f6d825abeec560211a05730a8))

  Consumers no longer need bundler aliases to resolve ESM entry points.
  Declares explicit exports map with entries for main entrypoint,
  ./styles (CSS), ./dist/styles.css (compat), and ./package.json.
  Deep dist/ imports not listed will stop resolving.

- **chip:** require React 18 as minimum peer dependency ([71a1996](https://github.com/entur/design-system/commit/71a1996dbf868c77857f2c935fca30fbc71a4e4d))

### BREAKING CHANGES

- **chip:** undocumented deep imports into dist/ may break.
- **chip:** require React 18 as minimum peer dependency

## [0.10.16](https://github.com/entur/design-system/compare/@entur/chip@0.10.15...@entur/chip@0.10.16) (2026-07-03)

### Entur Dependency Updates

- **@entur/form:** `^9.3.7` → `^9.3.8` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#938-2026-07-03))
- **@entur/icons:** `^9.0.3` → `^9.0.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#904-2026-07-03))
- **@entur/loader:** `^0.7.3` → `^0.7.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#074-2026-07-03))
- **@entur/utils:** `^0.13.5` → `^0.13.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0136-2026-07-03))

## [0.10.15](https://github.com/entur/design-system/compare/@entur/chip@0.10.13...@entur/chip@0.10.15) (2026-06-22)

### Entur Dependency Updates

- **@entur/form:** `^9.3.6` → `^9.3.7` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#937-2026-06-22))
- **@entur/icons:** `^9.0.2` → `^9.0.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#903-2026-06-22))
- **@entur/loader:** `^0.7.2` → `^0.7.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#073-2026-06-22))
- **@entur/tokens:** `^3.23.0` → `^3.24.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3240-2026-06-22))

## [0.10.14](https://github.com/entur/design-system/compare/@entur/chip@0.10.13...@entur/chip@0.10.14) (2026-06-08)

### Entur Dependency Updates

- **@entur/form:** `^9.3.5` → `^9.3.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#936-2026-06-08))
- **@entur/icons:** `^9.0.1` → `^9.0.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#902-2026-06-08))
- **@entur/loader:** `^0.7.1` → `^0.7.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#072-2026-06-08))

## [0.10.13](https://github.com/entur/design-system/compare/@entur/chip@0.10.12...@entur/chip@0.10.13) (2026-06-08)

### Entur Dependency Updates

- **@entur/form:** `^9.3.4` → `^9.3.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#935-2026-06-08))
- **@entur/icons:** `^9.0.0` → `^9.0.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#901-2026-06-08))
- **@entur/loader:** `^0.7.0` → `^0.7.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#071-2026-06-08))

## [0.10.12](https://github.com/entur/design-system/compare/@entur/chip@0.10.10...@entur/chip@0.10.12) (2026-06-05)

### Entur Dependency Updates

- **@entur/form:** `^9.3.3` → `^9.3.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#934-2026-06-05))
- **@entur/icons:** `^8.4.6` → `^9.0.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#900-2026-06-05))
- **@entur/loader:** `^0.6.7` → `^0.7.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#070-2026-06-05))
- **@entur/tokens:** `^3.22.5` → `^3.23.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3230-2026-06-05))
- **@entur/utils:** `^0.13.4` → `^0.13.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0135-2026-06-05))

## [0.10.11](https://github.com/entur/design-system/compare/@entur/chip@0.10.10...@entur/chip@0.10.11) (2026-05-13)

### Entur Dependency Updates

- **@entur/form:** `^9.3.2` → `^9.3.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#933-2026-05-13))
- **@entur/icons:** `^8.4.5` → `^8.4.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#846-2026-05-13))
- **@entur/loader:** `^0.6.6` → `^0.6.7` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#067-2026-05-13))
- **@entur/tokens:** `^3.22.4` → `^3.22.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3225-2026-05-13))
- **@entur/utils:** `^0.13.3` → `^0.13.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0134-2026-05-13))

## [0.10.10](https://github.com/entur/design-system/compare/@entur/chip@0.10.9...@entur/chip@0.10.10) (2026-04-16)

### Entur Dependency Updates

- **@entur/form:** `^9.3.0` → `^9.3.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#932-2026-04-16))
- **@entur/icons:** `^8.4.4` → `^8.4.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md))
- **@entur/loader:** `^0.6.5` → `^0.6.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md))
- **@entur/tokens:** `^3.22.3` → `^3.22.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md))
- **@entur/utils:** `^0.13.2` → `^0.13.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md))

## [0.10.8](https://github.com/entur/design-system/compare/@entur/chip@0.10.7...@entur/chip@0.10.8) (2026-03-16)

### Entur Dependency Updates

- **@entur/form:** `^9.2.6` → `^9.3.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#930-2026-03-16))
- **@entur/icons:** `^8.4.3` → `^8.4.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#844-2026-03-16))
- **@entur/loader:** `^0.6.4` → `^0.6.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#065-2026-03-16))
- **@entur/tokens:** `^3.22.2` → `^3.22.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3223-2026-03-16))
- **@entur/utils:** `^0.13.1` → `^0.13.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0132-2026-03-16))

## [0.10.6](https://github.com/entur/design-system/compare/@entur/chip@0.10.5...@entur/chip@0.10.6) (2026-02-20)

### Entur Dependency Updates

- **@entur/form:** `^9.2.5` → `^9.2.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#926-2026-02-20))
- **@entur/icons:** `^8.4.2` → `^8.4.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#843-2026-02-20))
- **@entur/loader:** `^0.6.3` → `^0.6.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#064-2026-02-20))
- **@entur/tokens:** `^3.22.1` → `^3.22.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3222-2026-02-20))

## [0.10.5](https://github.com/entur/design-system/compare/@entur/chip@0.10.4...@entur/chip@0.10.5) (2026-02-05)

### Entur Dependency Updates

- **@entur/form:** `^9.2.4` → `^9.2.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#925-2026-02-05))

## [0.10.4](https://github.com/entur/design-system/compare/@entur/chip@0.10.3...@entur/chip@0.10.4) (2026-01-28)

### Entur Dependency Updates

- **@entur/form:** `^9.2.3` → `^9.2.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#924-2026-01-28))
- **@entur/icons:** `^8.4.1` → `^8.4.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#842-2026-01-28))
- **@entur/loader:** `^0.6.2` → `^0.6.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#063-2026-01-28))
- **@entur/tokens:** `^3.22.0` → `^3.22.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3221-2026-01-28))

## [0.10.3](https://github.com/entur/design-system/compare/@entur/chip@0.10.2...@entur/chip@0.10.3) (2026-01-23)

### Entur Dependency Updates

- **@entur/form:** `^9.2.2` → `^9.2.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#923-2026-01-23))

## [0.10.2](https://github.com/entur/design-system/compare/@entur/chip@0.10.1...@entur/chip@0.10.2) (2026-01-23)

### Entur Dependency Updates

- **@entur/form:** `^9.2.0` → `^9.2.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#922-2026-01-23))
- **@entur/icons:** `^8.3.1` → `^8.4.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#841-2026-01-23))
- **@entur/loader:** `^0.6.0` → `^0.6.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#062-2026-01-23))
- **@entur/tokens:** `^3.21.0` → `^3.22.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3220-2026-01-23))
- **@entur/utils:** `^0.13.0` → `^0.13.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md))

# [0.10.0](https://github.com/entur/design-system/compare/@entur/chip@0.9.9...@entur/chip@0.10.0) (2025-12-05)

### Features

- add new component size css variables to all relevant packages ([aceafa8](https://github.com/entur/design-system/commit/aceafa85c8da121ad0654fb08caad22257c16bc9))

## [0.9.9](https://github.com/entur/design-system/compare/@entur/chip@0.9.8...@entur/chip@0.9.9) (2025-11-24)

### Bug Fixes

- remove unneccesary vendor prefixes from source scss files ([14fe64e](https://github.com/entur/design-system/commit/14fe64eac51ae7756ea096cdc2c3b1e8bc1cb921))

  Vendor prefixas are now added via PostCSS instead

## [0.9.8](https://github.com/entur/design-system/compare/@entur/chip@0.9.7...@entur/chip@0.9.8) (2025-10-27)

### Entur Dependency Updates

- **@entur/form:** `^9.0.0` → `^9.0.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#901-2025-10-27))

## [0.9.7](https://github.com/entur/design-system/compare/@entur/chip@0.9.6...@entur/chip@0.9.7) (2025-10-27)

### Entur Dependency Updates

- **@entur/form:** `^8.4.2` → `^9.0.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#900-2025-10-27))

## [0.9.6](https://github.com/entur/design-system/compare/@entur/chip@0.9.5...@entur/chip@0.9.6) (2025-10-20)

### Entur Dependency Updates

- **@entur/form:** `^8.4.1` → `^8.4.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#842-2025-10-20))
- **@entur/icons:** `^8.1.0` → `^8.2.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#820-2025-10-20))
- **@entur/loader:** `^0.5.34` → `^0.5.35` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0535-2025-10-20))

## [0.9.5](https://github.com/entur/design-system/compare/@entur/chip@0.9.4...@entur/chip@0.9.5) (2025-10-17)

### Entur Dependency Updates

- **@entur/form:** `^8.4.0` → `^8.4.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#841-2025-10-17))
- **@entur/loader:** `^0.5.33` → `^0.5.34` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0534-2025-10-17))

## [0.9.4](https://github.com/entur/design-system/compare/@entur/chip@0.9.3...@entur/chip@0.9.4) (2025-09-30)

### Entur Dependency Updates

- **@entur/form:** `^8.3.4` → `^8.4.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#840-2025-09-30))
- **@entur/icons:** `^8.0.2` → `^8.1.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#810-2025-09-30))
- **@entur/loader:** `^0.5.32` → `^0.5.33` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0533-2025-09-30))
- **@entur/tokens:** `^3.19.3` → `^3.20.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3200-2025-09-30))

## [0.9.3](https://github.com/entur/design-system/compare/@entur/chip@0.9.2...@entur/chip@0.9.3) (2025-09-24)

### Entur Dependency Updates

- **@entur/form:** `^8.3.2` → `^8.3.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#834-2025-09-24))
- **@entur/icons:** `^8.0.1` → `^8.0.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md))
- **@entur/loader:** `^0.5.30` → `^0.5.32` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0532-2025-09-24))
- **@entur/tokens:** `^3.19.2` → `^3.19.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md))
- **@entur/utils:** `^0.12.4` → `^0.12.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md))

## [0.9.1](https://github.com/entur/design-system/compare/@entur/chip@0.9.0...@entur/chip@0.9.1) (2025-08-29)

### Bug Fixes

- **deps:** bump minor for dependencies ([bdde8f2](https://github.com/entur/design-system/commit/bdde8f2d5ab46cfa307a424429063b9700edfc1e))

  classnames, react-focus-lock, @react-aria, @react-stately, @internationalized/date, react-dropzone

- exclude dependencies from bundle ([5252a14](https://github.com/entur/design-system/commit/5252a14c4c615452f3cc7effc73287a5ee42399e))
- fix package.json field order ([7de85f2](https://github.com/entur/design-system/commit/7de85f2baf08a1fc3a0223e3f149c8cf9636546b))

  incorrect order made types unavailable

# [0.9.0](https://github.com/entur/design-system/compare/@entur/chip@0.8.12...@entur/chip@0.9.0) (2025-07-29)

### Features

- **chip:** add spacing for leading and trailing icons in text ([905b917](https://github.com/entur/design-system/commit/905b9179040edec0ea9217a0dc14acdf77c89de7))

## [0.8.12](https://github.com/entur/design-system/compare/@entur/chip@0.8.11...@entur/chip@0.8.12) (2025-06-27)

### Entur Dependency Updates

- **@entur/form:** `^8.2.11` → `^8.3.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#830-2025-06-27))
- **@entur/icons:** `^7.14.0` → `^8.0.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#800-2025-06-27))
- **@entur/loader:** `^0.5.28` → `^0.5.29` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0529-2025-06-27))

## [0.8.11](https://github.com/entur/design-system/compare/@entur/chip@0.8.10...@entur/chip@0.8.11) (2025-06-17)

### Entur Dependency Updates

- **@entur/form:** `^8.2.10` → `^8.2.11` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#8211-2025-06-17))
- **@entur/icons:** `^7.13.0` → `^7.14.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#7140-2025-06-17))
- **@entur/loader:** `^0.5.27` → `^0.5.28` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0528-2025-06-17))

## [0.8.10](https://github.com/entur/design-system/compare/@entur/chip@0.8.10-beta.0...@entur/chip@0.8.10) (2025-06-06)

### Entur Dependency Updates

- **@entur/form:** `^8.2.10-beta.0` → `^8.2.10` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#8210-2025-06-06))
- **@entur/icons:** `^7.13.0-beta.0` → `^7.13.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#7130-2025-06-06))
- **@entur/loader:** `^0.5.27-beta.0` → `^0.5.27` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0527-2025-06-06))

## [0.8.10-beta.0](https://github.com/entur/design-system/compare/@entur/chip@0.8.9...@entur/chip@0.8.10-beta.0) (2025-06-06)

### Entur Dependency Updates

- **@entur/form:** `^8.2.9` → `^8.2.10-beta.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#8210-beta0-2025-06-06))
- **@entur/icons:** `^7.12.0` → `^7.13.0-beta.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#7130-beta0-2025-06-06))
- **@entur/loader:** `^0.5.26` → `^0.5.27-beta.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0527-beta0-2025-06-06))

## [0.8.9](https://github.com/entur/design-system/compare/@entur/chip@0.8.8...@entur/chip@0.8.9) (2025-05-22)

### Entur Dependency Updates

- **@entur/form:** `^8.2.8` → `^8.2.9` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#829-2025-05-22))
- **@entur/icons:** `^7.11.1` → `^7.12.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#7120-2025-05-22))
- **@entur/loader:** `^0.5.25` → `^0.5.26` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0526-2025-05-22))
- **@entur/tokens:** `^3.19.0` → `^3.19.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3191-2025-05-22))

## [0.8.8](https://github.com/entur/design-system/compare/@entur/chip@0.8.7...@entur/chip@0.8.8) (2025-04-29)

### Entur Dependency Updates

- **@entur/form:** `^8.2.7` → `^8.2.8` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#828-2025-04-29))
- **@entur/icons:** `^7.11.0` → `^7.11.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#7111-2025-04-29))
- **@entur/loader:** `^0.5.24` → `^0.5.25` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0525-2025-04-29))

## [0.8.7](https://github.com/entur/design-system/compare/@entur/chip@0.8.6...@entur/chip@0.8.7) (2025-04-29)

### Entur Dependency Updates

- **@entur/form:** `^8.2.6` → `^8.2.7` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#827-2025-04-29))
- **@entur/icons:** `^7.10.0` → `^7.11.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#7110-2025-04-29))
- **@entur/loader:** `^0.5.23` → `^0.5.24` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0524-2025-04-29))

## [0.8.6](https://github.com/entur/design-system/compare/@entur/chip@0.8.5...@entur/chip@0.8.6) (2025-04-23)

### Entur Dependency Updates

- **@entur/form:** `^8.2.5` → `^8.2.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#826-2025-04-23))
- **@entur/icons:** `^7.9.0` → `^7.10.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#7100-2025-04-23))
- **@entur/loader:** `^0.5.22` → `^0.5.23` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0523-2025-04-23))

## [0.8.5](https://github.com/entur/design-system/compare/@entur/chip@0.8.4...@entur/chip@0.8.5) (2025-04-11)

### Entur Dependency Updates

- **@entur/form:** `^8.2.4` → `^8.2.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#825-2025-04-11))
- **@entur/icons:** `^7.8.0` → `^7.9.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#790-2025-04-11))
- **@entur/loader:** `^0.5.21` → `^0.5.22` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0522-2025-04-11))

## [0.8.4](https://github.com/entur/design-system/compare/@entur/chip@0.8.3...@entur/chip@0.8.4) (2025-03-24)

### Entur Dependency Updates

- **@entur/form:** `^8.2.3` → `^8.2.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#824-2025-03-24))
- **@entur/icons:** `^7.7.1` → `^7.8.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#780-2025-03-24))
- **@entur/loader:** `^0.5.20` → `^0.5.21` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0521-2025-03-24))
- **@entur/tokens:** `^3.18.0` → `^3.19.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3190-2025-03-24))
- **@entur/utils:** `^0.12.2` → `^0.12.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0123-2025-03-24))

## [0.8.3](https://github.com/entur/design-system/compare/@entur/chip@0.8.2...@entur/chip@0.8.3) (2025-03-05)

### Entur Dependency Updates

- **@entur/form:** `^8.2.2` → `^8.2.3` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#823-2025-03-05))
- **@entur/icons:** `^7.7.0` → `^7.7.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#771-2025-03-05))
- **@entur/loader:** `^0.5.19` → `^0.5.20` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0520-2025-03-05))
- **@entur/tokens:** `^3.17.6` → `^3.18.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3180-2025-03-05))

## [0.8.2](https://github.com/entur/design-system/compare/@entur/chip@0.8.1...@entur/chip@0.8.2) (2025-02-25)

### Entur Dependency Updates

- **@entur/form:** `^8.2.1` → `^8.2.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#822-2025-02-25))
- **@entur/icons:** `^7.6.1` → `^7.7.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#770-2025-02-25))
- **@entur/loader:** `^0.5.18` → `^0.5.19` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0519-2025-02-25))

## [0.8.1](https://github.com/entur/design-system/compare/@entur/chip@0.8.0...@entur/chip@0.8.1) (2025-02-20)

### Entur Dependency Updates

- **@entur/form:** `^8.2.0` → `^8.2.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#821-2025-02-20))
- **@entur/icons:** `^7.6.0` → `^7.6.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#761-2025-02-20))
- **@entur/loader:** `^0.5.17` → `^0.5.18` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0518-2025-02-20))
- **@entur/tokens:** `^3.17.5` → `^3.17.6` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3176-2025-02-20))

# [0.8.0](https://github.com/entur/design-system/compare/@entur/chip@0.7.28...@entur/chip@0.8.0) (2025-01-24)

### Features

- **chip:** replace focus with focus-visible ([ad0c6f0](https://github.com/entur/design-system/commit/ad0c6f0bf2ebd8117f618d50f801fc87a31bad47))

## [0.7.28](https://github.com/entur/design-system/compare/@entur/chip@0.7.27...@entur/chip@0.7.28) (2025-01-15)

### Entur Dependency Updates

- **@entur/form:** `^8.1.9` → `^8.1.10` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#8110-2025-01-15))
- **@entur/icons:** `^7.5.1` → `^7.6.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#760-2025-01-15))
- **@entur/loader:** `^0.5.15` → `^0.5.16` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0516-2025-01-15))
- **@entur/tokens:** `^3.17.4` → `^3.17.5` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3175-2025-01-15))

## [0.7.27](https://github.com/entur/design-system/compare/@entur/chip@0.7.27-RC.0...@entur/chip@0.7.27) (2025-01-14)

### Entur Dependency Updates

- **@entur/form:** `^8.1.9-RC.0` → `^8.1.9` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#819-2025-01-14))
- **@entur/icons:** `^7.5.1-RC.0` → `^7.5.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#751-2025-01-14))
- **@entur/loader:** `^0.5.15-RC.0` → `^0.5.15` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0515-2025-01-14))
- **@entur/tokens:** `^3.17.4-RC.0` → `^3.17.4` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3174-2025-01-14))
- **@entur/utils:** `^0.12.2-RC.0` → `^0.12.2` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0122-2025-01-14))

## [0.7.27-RC.0](https://github.com/entur/design-system/compare/@entur/chip@0.7.26...@entur/chip@0.7.27-RC.0) (2025-01-09)

### Entur Dependency Updates

- **@entur/form:** `^8.1.8` → `^8.1.9-RC.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/form/CHANGELOG.md#819-rc0-2025-01-09))
- **@entur/icons:** `^7.5.0` → `^7.5.1-RC.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/icons/CHANGELOG.md#751-rc0-2025-01-09))
- **@entur/loader:** `^0.5.14` → `^0.5.15-RC.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/loader/CHANGELOG.md#0515-rc0-2025-01-09))
- **@entur/tokens:** `^3.17.3` → `^3.17.4-RC.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#3174-rc0-2025-01-09))
- **@entur/utils:** `^0.12.1` → `^0.12.2-RC.0` ([changelog](https://github.com/entur/design-system/blob/main/packages/utils/CHANGELOG.md#0122-rc0-2025-01-09))

## [0.7.26](https://github.com/entur/design-system/compare/@entur/chip@0.7.25...@entur/chip@0.7.26) (2024-12-06)

**Note:** Version bump only for package @entur/chip

## [0.7.25](https://github.com/entur/design-system/compare/@entur/chip@0.7.24...@entur/chip@0.7.25) (2024-11-20)

**Note:** Version bump only for package @entur/chip

## [0.7.24](https://github.com/entur/design-system/compare/@entur/chip@0.7.23...@entur/chip@0.7.24) (2024-11-12)

**Note:** Version bump only for package @entur/chip

## [0.7.23](https://github.com/entur/design-system/compare/@entur/chip@0.7.22...@entur/chip@0.7.23) (2024-10-23)

### Bug Fixes

- **tokens:** add [@forward](https://bitbucket.org/forward) export in scss stylesheets that import scss variabels ([7141592](https://github.com/entur/design-system/commits/71415926888eda23e02efaf98a611043f9fd9b2f))

## [0.7.22](https://github.com/entur/design-system/compare/@entur/chip@0.7.21...@entur/chip@0.7.22) (2024-10-16)

**Note:** Version bump only for package @entur/chip

## [0.7.21](https://github.com/entur/design-system/compare/@entur/chip@0.7.19...@entur/chip@0.7.21) (2024-10-03)

**Note:** Version bump only for package @entur/chip

## [0.7.20](https://github.com/entur/design-system/compare/@entur/chip@0.7.19...@entur/chip@0.7.20) (2024-09-23)

**Note:** Version bump only for package @entur/chip

## [0.7.19](https://github.com/entur/design-system/compare/@entur/chip@0.7.18...@entur/chip@0.7.19) (2024-09-19)

**Note:** Version bump only for package @entur/chip

## [0.7.18](https://github.com/entur/design-system/compare/@entur/chip@0.7.17...@entur/chip@0.7.18) (2024-09-10)

**Note:** Version bump only for package @entur/chip

## [0.7.17](https://github.com/entur/design-system/compare/@entur/chip@0.7.16...@entur/chip@0.7.17) (2024-08-28)

**Note:** Version bump only for package @entur/chip

## [0.7.16](https://github.com/entur/design-system/compare/@entur/chip@0.7.15...@entur/chip@0.7.16) (2024-08-12)

**Note:** Version bump only for package @entur/chip

## [0.7.15](https://github.com/entur/design-system/compare/@entur/chip@0.7.14...@entur/chip@0.7.15) (2024-07-11)

**Note:** Version bump only for package @entur/chip

## [0.7.14](https://github.com/entur/design-system/compare/@entur/chip@0.7.13...@entur/chip@0.7.14) (2024-07-11)

**Note:** Version bump only for package @entur/chip

## [0.7.13](https://github.com/entur/design-system/compare/@entur/chip@0.7.12...@entur/chip@0.7.13) (2024-06-24)

**Note:** Version bump only for package @entur/chip

## [0.7.12](https://github.com/entur/design-system/compare/@entur/chip@0.7.11...@entur/chip@0.7.12) (2024-06-11)

**Note:** Version bump only for package @entur/chip

## [0.7.11](https://github.com/entur/design-system/compare/@entur/chip@0.7.10...@entur/chip@0.7.11) (2024-05-29)

**Note:** Version bump only for package @entur/chip

## [0.7.10](https://github.com/entur/design-system/compare/@entur/chip@0.7.9...@entur/chip@0.7.10) (2024-05-21)

**Note:** Version bump only for package @entur/chip

## [0.7.9](https://github.com/entur/design-system/compare/@entur/chip@0.7.8...@entur/chip@0.7.9) (2024-05-13)

**Note:** Version bump only for package @entur/chip

## [0.7.8](https://github.com/entur/design-system/compare/@entur/chip@0.7.7...@entur/chip@0.7.8) (2024-05-07)

**Note:** Version bump only for package @entur/chip

## [0.7.7](https://github.com/entur/design-system/compare/@entur/chip@0.7.6...@entur/chip@0.7.7) (2024-05-06)

**Note:** Version bump only for package @entur/chip

## [0.7.6](https://github.com/entur/design-system/compare/@entur/chip@0.7.5...@entur/chip@0.7.6) (2024-04-24)

**Note:** Version bump only for package @entur/chip

## [0.7.5](https://github.com/entur/design-system/compare/@entur/chip@0.7.4...@entur/chip@0.7.5) (2024-04-22)

**Note:** Version bump only for package @entur/chip

## [0.7.4](https://github.com/entur/design-system/compare/@entur/chip@0.7.3...@entur/chip@0.7.4) (2024-04-18)

**Note:** Version bump only for package @entur/chip

## [0.7.3](https://github.com/entur/design-system/compare/@entur/chip@0.7.2...@entur/chip@0.7.3) (2024-04-18)

**Note:** Version bump only for package @entur/chip

## [0.7.2](https://github.com/entur/design-system/compare/@entur/chip@0.7.1...@entur/chip@0.7.2) (2024-04-12)

**Note:** Version bump only for package @entur/chip

## [0.7.1](https://github.com/entur/design-system/compare/@entur/chip@0.7.0...@entur/chip@0.7.1) (2024-04-11)

**Note:** Version bump only for package @entur/chip

# [0.7.0](https://github.com/entur/design-system/compare/@entur/chip@0.6.70...@entur/chip@0.7.0) (2024-04-10)

### Bug Fixes

- migrate away from legacy tilde imports in sass ([cc16e7f](https://github.com/entur/design-system/commits/cc16e7f1a8d65143ab0dd583aea76b5ba11be148))

### Features

- **chip:** add size small and small fix ([433646e](https://github.com/entur/design-system/commits/433646e725831edbf1d7c24bc590304d6e876034))
- **chip:** add size small chip ([301077d](https://github.com/entur/design-system/commits/301077db50c6f4380b5cc39d9116a5fd15843635))

## [0.6.70](https://github.com/entur/design-system/compare/@entur/chip@0.6.69...@entur/chip@0.6.70) (2024-03-27)

**Note:** Version bump only for package @entur/chip

## [0.6.69](https://github.com/entur/design-system/compare/@entur/chip@0.6.68...@entur/chip@0.6.69) (2024-03-25)

**Note:** Version bump only for package @entur/chip

## [0.6.68](https://github.com/entur/design-system/compare/@entur/chip@0.6.67...@entur/chip@0.6.68) (2024-03-21)

**Note:** Version bump only for package @entur/chip

## [0.6.67](https://github.com/entur/design-system/compare/@entur/chip@0.6.66...@entur/chip@0.6.67) (2024-03-15)

**Note:** Version bump only for package @entur/chip

## [0.6.66](https://github.com/entur/design-system/compare/@entur/chip@0.6.65...@entur/chip@0.6.66) (2024-03-06)

**Note:** Version bump only for package @entur/chip

## [0.6.65](https://github.com/entur/design-system/compare/@entur/chip@0.6.64...@entur/chip@0.6.65) (2024-02-22)

**Note:** Version bump only for package @entur/chip

## [0.6.64](https://github.com/entur/design-system/compare/@entur/chip@0.6.63...@entur/chip@0.6.64) (2024-02-12)

**Note:** Version bump only for package @entur/chip

## [0.6.63](https://github.com/entur/design-system/compare/@entur/chip@0.6.62...@entur/chip@0.6.63) (2024-02-01)

**Note:** Version bump only for package @entur/chip

## [0.6.62](https://github.com/entur/design-system/compare/@entur/chip@0.6.61...@entur/chip@0.6.62) (2024-01-24)

**Note:** Version bump only for package @entur/chip

## [0.6.61](https://github.com/entur/design-system/compare/@entur/chip@0.6.60...@entur/chip@0.6.61) (2024-01-08)

**Note:** Version bump only for package @entur/chip

## [0.6.60](https://github.com/entur/design-system/compare/@entur/chip@0.6.59...@entur/chip@0.6.60) (2023-12-22)

**Note:** Version bump only for package @entur/chip

## [0.6.59](https://github.com/entur/design-system/compare/@entur/chip@0.6.58...@entur/chip@0.6.59) (2023-12-18)

**Note:** Version bump only for package @entur/chip

## [0.6.58](https://github.com/entur/design-system/compare/@entur/chip@0.6.57...@entur/chip@0.6.58) (2023-12-11)

**Note:** Version bump only for package @entur/chip

## [0.6.56](https://github.com/entur/design-system/compare/@entur/chip@0.6.55...@entur/chip@0.6.56) (2023-12-04)

**Note:** Version bump only for package @entur/chip

## [0.6.55](https://github.com/entur/design-system/compare/@entur/chip@0.6.54...@entur/chip@0.6.55) (2023-11-16)

**Note:** Version bump only for package @entur/chip

## [0.6.54](https://github.com/entur/design-system/compare/@entur/chip@0.6.53...@entur/chip@0.6.54) (2023-10-30)

**Note:** Version bump only for package @entur/chip

## [0.6.53](https://github.com/entur/design-system/compare/@entur/chip@0.6.52...@entur/chip@0.6.53) (2023-10-23)

**Note:** Version bump only for package @entur/chip

## [0.6.52](https://github.com/entur/design-system/compare/@entur/chip@0.6.51...@entur/chip@0.6.52) (2023-10-11)

**Note:** Version bump only for package @entur/chip

## [0.6.51](https://github.com/entur/design-system/compare/@entur/chip@0.6.50...@entur/chip@0.6.51) (2023-10-11)

**Note:** Version bump only for package @entur/chip

## [0.6.50](https://github.com/entur/design-system/compare/@entur/chip@0.6.49...@entur/chip@0.6.50) (2023-10-06)

**Note:** Version bump only for package @entur/chip

## [0.6.49](https://github.com/entur/design-system/compare/@entur/chip@0.6.48...@entur/chip@0.6.49) (2023-10-06)

**Note:** Version bump only for package @entur/chip

## [0.6.48](https://github.com/entur/design-system/compare/@entur/chip@0.6.45...@entur/chip@0.6.48) (2023-09-25)

**Note:** Version bump only for package @entur/chip

## [0.6.47](https://github.com/entur/design-system/compare/@entur/chip@0.6.45...@entur/chip@0.6.47) (2023-09-25)

**Note:** Version bump only for package @entur/chip

## [0.6.46](https://github.com/entur/design-system/compare/@entur/chip@0.6.46-beta.0...@entur/chip@0.6.46) (2023-09-12)

**Note:** Version bump only for package @entur/chip

## [0.6.46-beta.0](https://github.com/entur/design-system/compare/@entur/chip@0.6.45...@entur/chip@0.6.46-beta.0) (2023-09-12)

**Note:** Version bump only for package @entur/chip

## [0.6.45](https://github.com/entur/design-system/compare/@entur/chip@0.6.44...@entur/chip@0.6.45) (2023-09-08)

**Note:** Version bump only for package @entur/chip

## [0.6.44](https://github.com/entur/design-system/compare/@entur/chip@0.6.43...@entur/chip@0.6.44) (2023-08-28)

**Note:** Version bump only for package @entur/chip

## [0.6.43](https://github.com/entur/design-system/compare/@entur/chip@0.6.42...@entur/chip@0.6.43) (2023-08-24)

### Bug Fixes

- **choice chip group:** add gap between rows of choice chips in choice chip group on wrap ([9a17646](https://github.com/entur/design-system/commits/9a17646f4973ccf6609a852001a2b76452bdd5d4))

## [0.6.41](https://github.com/entur/design-system/compare/@entur/chip@0.6.40...@entur/chip@0.6.41) (2023-08-10)

**Note:** Version bump only for package @entur/chip

## [0.6.40](https://github.com/entur/design-system/compare/@entur/chip@0.6.39...@entur/chip@0.6.40) (2023-08-09)

**Note:** Version bump only for package @entur/chip

## [0.6.39](https://github.com/entur/design-system/compare/@entur/chip@0.6.38...@entur/chip@0.6.39) (2023-07-19)

**Note:** Version bump only for package @entur/chip

## [0.6.38](https://github.com/entur/design-system/compare/@entur/chip@0.6.37...@entur/chip@0.6.38) (2023-07-19)

**Note:** Version bump only for package @entur/chip

## [0.6.37](https://github.com/entur/design-system/compare/@entur/chip@0.6.36...@entur/chip@0.6.37) (2023-07-18)

**Note:** Version bump only for package @entur/chip

## [0.6.36](https://github.com/entur/design-system/compare/@entur/chip@0.6.35...@entur/chip@0.6.36) (2023-05-11)

**Note:** Version bump only for package @entur/chip

## [0.6.35](https://github.com/entur/design-system/compare/@entur/chip@0.6.34...@entur/chip@0.6.35) (2023-04-24)

**Note:** Version bump only for package @entur/chip

## [0.6.34](https://github.com/entur/design-system/compare/@entur/chip@0.6.33...@entur/chip@0.6.34) (2023-04-21)

**Note:** Version bump only for package @entur/chip

## [0.6.33](https://github.com/entur/design-system/compare/@entur/chip@0.6.32...@entur/chip@0.6.33) (2023-04-17)

### Bug Fixes

- **chips:** hide icons from screen readers ([2041a0a](https://github.com/entur/design-system/commits/2041a0a593e0cc9fefaf35d229012541a6be57ca))

## [0.6.32](https://github.com/entur/design-system/compare/@entur/chip@0.6.29...@entur/chip@0.6.32) (2023-04-13)

**Note:** Version bump only for package @entur/chip

## [0.6.31](https://github.com/entur/design-system/compare/@entur/chip@0.6.29...@entur/chip@0.6.31) (2023-04-05)

**Note:** Version bump only for package @entur/chip

## [0.6.30](https://github.com/entur/design-system/compare/@entur/chip@0.6.29...@entur/chip@0.6.30) (2023-04-04)

**Note:** Version bump only for package @entur/chip

## [0.6.29](https://github.com/entur/design-system/compare/@entur/chip@0.6.28...@entur/chip@0.6.29) (2023-04-03)

**Note:** Version bump only for package @entur/chip

## [0.6.28](https://github.com/entur/design-system/compare/@entur/chip@0.6.27...@entur/chip@0.6.28) (2023-04-03)

**Note:** Version bump only for package @entur/chip

## [0.6.27](https://github.com/entur/design-system/compare/@entur/chip@0.6.26...@entur/chip@0.6.27) (2023-03-27)

**Note:** Version bump only for package @entur/chip

## [0.6.26](https://github.com/entur/design-system/compare/@entur/chip@0.6.25...@entur/chip@0.6.26) (2023-03-15)

### Bug Fixes

- **chip:** fix incorrect padding calculation for leading and trailing icon inside chip ([2225215](https://github.com/entur/design-system/commits/22252156dbe3e41705780453060802a1b4cb6bbf))

## [0.6.25](https://github.com/entur/design-system/compare/@entur/chip@0.6.24...@entur/chip@0.6.25) (2023-03-13)

**Note:** Version bump only for package @entur/chip

## [0.6.24](https://github.com/entur/design-system/compare/@entur/chip@0.6.23...@entur/chip@0.6.24) (2023-03-07)

**Note:** Version bump only for package @entur/chip

## [0.6.23](https://github.com/entur/design-system/compare/@entur/chip@0.6.22...@entur/chip@0.6.23) (2023-03-03)

**Note:** Version bump only for package @entur/chip

## [0.6.22](https://github.com/entur/design-system/compare/@entur/chip@0.6.21...@entur/chip@0.6.22) (2023-02-17)

**Note:** Version bump only for package @entur/chip

## [0.6.21](https://github.com/entur/design-system/compare/@entur/chip@0.6.18...@entur/chip@0.6.21) (2023-02-17)

**Note:** Version bump only for package @entur/chip

## [0.6.20](https://github.com/entur/design-system/compare/@entur/chip@0.6.18...@entur/chip@0.6.20) (2023-02-15)

**Note:** Version bump only for package @entur/chip

## [0.6.19](https://github.com/entur/design-system/compare/@entur/chip@0.6.18...@entur/chip@0.6.19) (2023-02-09)

**Note:** Version bump only for package @entur/chip

## [0.6.18](https://github.com/entur/design-system/compare/@entur/chip@0.6.17...@entur/chip@0.6.18) (2023-02-02)

**Note:** Version bump only for package @entur/chip

## [0.6.16](https://github.com/entur/design-system/compare/@entur/chip@0.6.15...@entur/chip@0.6.16) (2023-01-19)

**Note:** Version bump only for package @entur/chip

## [0.6.15](https://github.com/entur/design-system/compare/@entur/chip@0.6.12...@entur/chip@0.6.15) (2022-12-09)

**Note:** Version bump only for package @entur/chip

## [0.6.14](https://github.com/entur/design-system/compare/@entur/chip@0.6.13...@entur/chip@0.6.14) (2022-11-24)

**Note:** Version bump only for package @entur/chip

## [0.6.13](https://github.com/entur/design-system/compare/@entur/chip@0.6.12...@entur/chip@0.6.13) (2022-10-31)

**Note:** Version bump only for package @entur/chip

## [0.6.12](https://github.com/entur/design-system/compare/@entur/chip@0.6.11...@entur/chip@0.6.12) (2022-10-31)

**Note:** Version bump only for package @entur/chip

## [0.6.11](https://github.com/entur/design-system/compare/@entur/chip@0.6.10...@entur/chip@0.6.11) (2022-10-31)

**Note:** Version bump only for package @entur/chip

## [0.6.10](https://github.com/entur/design-system/compare/@entur/chip@0.6.9...@entur/chip@0.6.10) (2022-10-20)

**Note:** Version bump only for package @entur/chip

## [0.6.9](https://github.com/entur/design-system/compare/@entur/chip@0.6.8...@entur/chip@0.6.9) (2022-10-20)

**Note:** Version bump only for package @entur/chip

## [0.6.8](https://github.com/entur/design-system/compare/@entur/chip@0.6.7...@entur/chip@0.6.8) (2022-10-12)

**Note:** Version bump only for package @entur/chip

## [0.6.6](https://github.com/entur/design-system/compare/@entur/chip@0.6.5...@entur/chip@0.6.6) (2022-08-31)

**Note:** Version bump only for package @entur/chip

## [0.6.5](https://github.com/entur/design-system/compare/@entur/chip@0.6.4...@entur/chip@0.6.5) (2022-08-24)

**Note:** Version bump only for package @entur/chip

## [0.6.4](https://github.com/entur/design-system/compare/@entur/chip@0.6.3...@entur/chip@0.6.4) (2022-08-12)

### Bug Fixes

- **choice chip:** remove opacitiy when chip is disabled ([7412724](https://github.com/entur/design-system/commits/741272400dda7ff77aa58b5032dd91f91d3a0393))

## [0.6.3](https://github.com/entur/design-system/compare/@entur/chip@0.6.2...@entur/chip@0.6.3) (2022-08-09)

**Note:** Version bump only for package @entur/chip

## [0.6.2](https://github.com/entur/design-system/compare/@entur/chip@0.6.1...@entur/chip@0.6.2) (2022-08-09)

**Note:** Version bump only for package @entur/chip

## [0.6.1](https://github.com/entur/design-system/compare/@entur/chip@0.6.0...@entur/chip@0.6.1) (2022-07-05)

**Note:** Version bump only for package @entur/chip

# [0.6.0](https://github.com/entur/design-system/compare/@entur/chip@0.5.8...@entur/chip@0.6.0) (2022-06-28)

### Features

- **action chip:** add aria-loading and aria-label text to action chip when loading ([2eaadbe](https://github.com/entur/design-system/commits/2eaadbe743049a57613d0c89cb17fab8128da915))
- **action chip:** add visual disabled indicator to actionChip ([15edd0d](https://github.com/entur/design-system/commits/15edd0da4111c79465f620dd008b7047fbf9cee7))
- **tag chip:** add autogenerated aria-label for tag close/remove button ([9e63b0a](https://github.com/entur/design-system/commits/9e63b0af9dfb618caa301aab3c954974aecb9bb0))

### BREAKING CHANGES

- **tag chip:** This change will add aria-label to all tag chip close buttons. If you already use this component,
  you should check that the accessible text makes sense and if it doesn't, change the text using the
  closeButtonAriaLabel prop

## [0.5.8](https://github.com/entur/design-system/compare/@entur/chip@0.5.7...@entur/chip@0.5.8) (2022-06-24)

**Note:** Version bump only for package @entur/chip

## [0.5.7](https://github.com/entur/design-system/compare/@entur/chip@0.5.6...@entur/chip@0.5.7) (2022-06-02)

**Note:** Version bump only for package @entur/chip

## [0.5.6](https://github.com/entur/design-system/compare/@entur/chip@0.5.5...@entur/chip@0.5.6) (2022-05-13)

**Note:** Version bump only for package @entur/chip

## [0.5.5](https://github.com/entur/design-system/compare/@entur/chip@0.5.4...@entur/chip@0.5.5) (2022-05-04)

**Note:** Version bump only for package @entur/chip

## [0.5.4](https://github.com/entur/design-system/compare/@entur/chip@0.5.3...@entur/chip@0.5.4) (2022-04-27)

**Note:** Version bump only for package @entur/chip

## [0.5.3](https://github.com/entur/design-system/compare/@entur/chip@0.5.2...@entur/chip@0.5.3) (2022-04-20)

**Note:** Version bump only for package @entur/chip

## [0.5.2](https://github.com/entur/design-system/compare/@entur/chip@0.5.1...@entur/chip@0.5.2) (2022-04-19)

**Note:** Version bump only for package @entur/chip

## [0.5.1](https://github.com/entur/design-system/compare/@entur/chip@0.5.0...@entur/chip@0.5.1) (2022-03-17)

### Bug Fixes

- **ChoiceChip:** add -webkit fallback for Safari ([d19f8c3](https://github.com/entur/design-system/commits/d19f8c34b401676283ff5fbc3b10ec0a1f04d3b8))

# [0.5.0](https://github.com/entur/design-system/compare/@entur/chip@0.4.24...@entur/chip@0.5.0) (2022-03-14)

### Features

- **action chip:** add loading state to action chip ([290e709](https://github.com/entur/design-system/commits/290e709baef2c7513fc3b85e834fabb34697842e))

## [0.4.24](https://github.com/entur/design-system/compare/@entur/chip@0.4.23...@entur/chip@0.4.24) (2022-03-01)

**Note:** Version bump only for package @entur/chip

## [0.4.23](https://github.com/entur/design-system/compare/@entur/chip@0.4.22...@entur/chip@0.4.23) (2022-02-09)

**Note:** Version bump only for package @entur/chip

## [0.4.22](https://github.com/entur/design-system/compare/@entur/chip@0.4.21...@entur/chip@0.4.22) (2022-01-21)

**Note:** Version bump only for package @entur/chip

## [0.4.21](https://github.com/entur/design-system/compare/@entur/chip@0.4.20...@entur/chip@0.4.21) (2022-01-05)

**Note:** Version bump only for package @entur/chip

## [0.4.20](https://github.com/entur/design-system/compare/@entur/chip@0.4.19...@entur/chip@0.4.20) (2021-12-10)

**Note:** Version bump only for package @entur/chip

## [0.4.19](https://github.com/entur/design-system/compare/@entur/chip@0.4.18...@entur/chip@0.4.19) (2021-11-17)

**Note:** Version bump only for package @entur/chip

## [0.4.18](https://github.com/entur/design-system/compare/@entur/chip@0.4.17...@entur/chip@0.4.18) (2021-10-25)

**Note:** Version bump only for package @entur/chip

## [0.4.17](https://github.com/entur/design-system/compare/@entur/chip@0.4.16...@entur/chip@0.4.17) (2021-10-18)

**Note:** Version bump only for package @entur/chip

## [0.4.16](https://github.com/entur/design-system/compare/@entur/chip@0.4.15...@entur/chip@0.4.16) (2021-09-23)

**Note:** Version bump only for package @entur/chip

## [0.4.15](https://github.com/entur/design-system/compare/@entur/chip@0.4.14...@entur/chip@0.4.15) (2021-09-13)

**Note:** Version bump only for package @entur/chip

## [0.4.14](https://github.com/entur/design-system/compare/@entur/chip@0.4.13...@entur/chip@0.4.14) (2021-09-07)

### Bug Fixes

- improve typings ([423e06a](https://github.com/entur/design-system/commits/423e06a1048731509fe0d3d6606e3fe390a868e1))
- utilize reworked focus token ([586758f](https://github.com/entur/design-system/commits/586758fc86eb5aa52116c63c14ef033eb2e8b12f))

## [0.4.13](https://github.com/entur/design-system/compare/@entur/chip@0.4.12...@entur/chip@0.4.13) (2021-08-13)

**Note:** Version bump only for package @entur/chip

## [0.4.12](https://github.com/entur/design-system/compare/@entur/chip@0.4.11...@entur/chip@0.4.12) (2021-07-16)

**Note:** Version bump only for package @entur/chip

## [0.4.11](https://github.com/entur/design-system/compare/@entur/chip@0.4.10...@entur/chip@0.4.11) (2021-06-25)

### Bug Fixes

- update dependencies ([b7f5e2d](https://github.com/entur/design-system/commits/b7f5e2dd6ccfd066d61fdda5d1892994ea5b28dd))

## [0.4.10](https://github.com/entur/design-system/compare/@entur/chip@0.4.9...@entur/chip@0.4.10) (2021-06-04)

**Note:** Version bump only for package @entur/chip

## [0.4.9](https://github.com/entur/design-system/compare/@entur/chip@0.4.8...@entur/chip@0.4.9) (2021-05-19)

**Note:** Version bump only for package @entur/chip

## [0.4.8](https://github.com/entur/design-system/compare/@entur/chip@0.4.7...@entur/chip@0.4.8) (2021-05-05)

**Note:** Version bump only for package @entur/chip

## [0.4.7](https://github.com/entur/design-system/compare/@entur/chip@0.4.6...@entur/chip@0.4.7) (2021-04-23)

### Bug Fixes

- utilize new focus tokens ([17113ef](https://github.com/entur/design-system/commits/17113ef3f791c86fa6e19e71680fd5acdbae4990))

## [0.4.6](https://github.com/entur/design-system/compare/@entur/chip@0.4.5...@entur/chip@0.4.6) (2021-04-09)

**Note:** Version bump only for package @entur/chip

## [0.4.5](https://github.com/entur/design-system/compare/@entur/chip@0.4.4...@entur/chip@0.4.5) (2021-03-02)

**Note:** Version bump only for package @entur/chip

## [0.4.4](https://github.com/entur/design-system/compare/@entur/chip@0.4.3...@entur/chip@0.4.4) (2021-02-17)

**Note:** Version bump only for package @entur/chip

## [0.4.3](https://github.com/entur/design-system/compare/@entur/chip@0.4.2...@entur/chip@0.4.3) (2021-02-05)

**Note:** Version bump only for package @entur/chip

## [0.4.2](https://github.com/entur/design-system/compare/@entur/chip@0.4.1...@entur/chip@0.4.2) (2021-01-29)

**Note:** Version bump only for package @entur/chip

## [0.4.1](https://github.com/entur/design-system/compare/@entur/chip@0.4.0...@entur/chip@0.4.1) (2021-01-20)

### Bug Fixes

- **choicechipgroup:** add label prop explicitly to typings ([eace8d6](https://github.com/entur/design-system/commits/eace8d6cd2a91dc79003b9a54042d007d8cd5a8c))

# [0.4.0](https://github.com/entur/design-system/compare/@entur/chip@0.3.41...@entur/chip@0.4.0) (2021-01-13)

### Features

- **choicechip:** update value type with support for null ([0311c32](https://github.com/entur/design-system/commits/0311c329f9a35a8d150c48e26d53bb902e4b3787))

## [0.3.41](https://github.com/entur/design-system/compare/@entur/chip@0.3.40...@entur/chip@0.3.41) (2021-01-05)

### Bug Fixes

- **actionchip:** improved typings ([66b3acc](https://github.com/entur/design-system/commits/66b3accad09a69a2c9cd0f8cd1221f2b32931489))
- **choicechip:** improve typings ([c839400](https://github.com/entur/design-system/commits/c839400ca651020bc685840d7a18a5d382d907b0))

## [0.3.40](https://github.com/entur/design-system/compare/@entur/chip@0.3.39...@entur/chip@0.3.40) (2020-12-04)

### Bug Fixes

- **actionchip:** improve typings ([3999811](https://github.com/entur/design-system/commits/399981153891f5131bd7af1e28bb5fc7f8fdf874))
- **choicechip:** improve typings ([17b93c1](https://github.com/entur/design-system/commits/17b93c197b05c277cec1b9bc28b0106b7e244be0))
- **filterchip:** improve typings ([c9ad609](https://github.com/entur/design-system/commits/c9ad6099243911b427885382dc0f5c1001cdee1d))
- **tagchip:** improve typings ([33b4310](https://github.com/entur/design-system/commits/33b431078ac73cde364a40dd27a44c4497f58d89))

## [0.3.39](https://github.com/entur/design-system/compare/@entur/chip@0.3.38...@entur/chip@0.3.39) (2020-11-26)

**Note:** Version bump only for package @entur/chip

## [0.3.38](https://github.com/entur/design-system/compare/@entur/chip@0.3.37...@entur/chip@0.3.38) (2020-11-10)

### Bug Fixes

- **choice chip:** improve typing of onchange prop ([e790234](https://github.com/entur/design-system/commits/e79023473e27c2c21016cb6394070a2ce8cd6f89))

## [0.3.37](https://github.com/entur/design-system/compare/@entur/chip@0.3.36...@entur/chip@0.3.37) (2020-11-05)

**Note:** Version bump only for package @entur/chip

## [0.3.36](https://github.com/entur/design-system/compare/@entur/chip@0.3.35...@entur/chip@0.3.36) (2020-10-28)

**Note:** Version bump only for package @entur/chip

## [0.3.35](https://github.com/entur/design-system/compare/@entur/chip@0.3.34...@entur/chip@0.3.35) (2020-10-23)

**Note:** Version bump only for package @entur/chip

## [0.3.34](https://github.com/entur/design-system/compare/@entur/chip@0.3.33...@entur/chip@0.3.34) (2020-10-16)

**Note:** Version bump only for package @entur/chip

## [0.3.33](https://github.com/entur/design-system/compare/@entur/chip@0.3.32...@entur/chip@0.3.33) (2020-10-09)

**Note:** Version bump only for package @entur/chip

## [0.3.32](https://github.com/entur/design-system/compare/@entur/chip@0.3.31...@entur/chip@0.3.32) (2020-10-09)

**Note:** Version bump only for package @entur/chip

## [0.3.31](https://github.com/entur/design-system/compare/@entur/chip@0.3.30...@entur/chip@0.3.31) (2020-09-25)

**Note:** Version bump only for package @entur/chip

## [0.3.30](https://github.com/entur/design-system/compare/@entur/chip@0.3.29...@entur/chip@0.3.30) (2020-09-14)

**Note:** Version bump only for package @entur/chip

## [0.3.29](https://github.com/entur/design-system/compare/@entur/chip@0.3.28...@entur/chip@0.3.29) (2020-09-10)

**Note:** Version bump only for package @entur/chip

## [0.3.28](https://github.com/entur/design-system/compare/@entur/chip@0.3.27...@entur/chip@0.3.28) (2020-09-02)

**Note:** Version bump only for package @entur/chip

## [0.3.27](https://github.com/entur/design-system/compare/@entur/chip@0.3.26...@entur/chip@0.3.27) (2020-08-26)

**Note:** Version bump only for package @entur/chip

## [0.3.26](https://github.com/entur/design-system/compare/@entur/chip@0.3.25...@entur/chip@0.3.26) (2020-08-20)

**Note:** Version bump only for package @entur/chip

## [0.3.25](https://github.com/entur/design-system/compare/@entur/chip@0.3.24...@entur/chip@0.3.25) (2020-08-19)

**Note:** Version bump only for package @entur/chip

## [0.3.24](https://github.com/entur/design-system/compare/@entur/chip@0.3.23...@entur/chip@0.3.24) (2020-08-14)

**Note:** Version bump only for package @entur/chip

## [0.3.23](https://github.com/entur/design-system/compare/@entur/chip@0.3.22...@entur/chip@0.3.23) (2020-08-11)

### Bug Fixes

- adjust disabled choicechip styling ([713a2ab](https://github.com/entur/design-system/commits/713a2abfc0285f0d78ee4c990e6bd2ee0c2b5e08))

## [0.3.22](https://github.com/entur/design-system/compare/@entur/chip@0.3.21...@entur/chip@0.3.22) (2020-07-24)

**Note:** Version bump only for package @entur/chip

## [0.3.21](https://github.com/entur/design-system/compare/@entur/chip@0.3.20...@entur/chip@0.3.21) (2020-07-22)

**Note:** Version bump only for package @entur/chip

## [0.3.20](https://github.com/entur/design-system/compare/@entur/chip@0.3.19...@entur/chip@0.3.20) (2020-07-16)

**Note:** Version bump only for package @entur/chip

## [0.3.19](https://github.com/entur/design-system/compare/@entur/chip@0.3.18...@entur/chip@0.3.19) (2020-07-13)

**Note:** Version bump only for package @entur/chip

## [0.3.18](https://github.com/entur/design-system/compare/@entur/chip@0.3.17...@entur/chip@0.3.18) (2020-07-09)

### Bug Fixes

- adjust choice chip background color ([0097236](https://github.com/entur/design-system/commits/009723686e9ff61e1fe9a24dee8e2c7a38cecb81))

## [0.3.17](https://github.com/entur/design-system/compare/@entur/chip@0.3.16...@entur/chip@0.3.17) (2020-07-03)

**Note:** Version bump only for package @entur/chip

## [0.3.16](https://github.com/entur/design-system/compare/@entur/chip@0.3.15...@entur/chip@0.3.16) (2020-06-17)

### Bug Fixes

- fix wrong definition of forward referencing ([e5cad92](https://github.com/entur/design-system/commits/e5cad92c59bc6453ab4dbe9a18c4c7e42dd7e00d))

## [0.3.15](https://github.com/entur/design-system/compare/@entur/chip@0.3.14...@entur/chip@0.3.15) (2020-05-27)

**Note:** Version bump only for package @entur/chip

## [0.3.14](https://github.com/entur/design-system/compare/@entur/chip@0.3.13...@entur/chip@0.3.14) (2020-05-26)

**Note:** Version bump only for package @entur/chip

## [0.3.13](https://github.com/entur/design-system/compare/@entur/chip@0.3.12...@entur/chip@0.3.13) (2020-05-20)

### Bug Fixes

- add forward referencing to TagChip ([08d0a57](https://github.com/entur/design-system/commits/08d0a579469ce615e2dfbe63d8ddc20e56b490a2))

## [0.3.12](https://github.com/entur/design-system/compare/@entur/chip@0.3.11...@entur/chip@0.3.12) (2020-04-27)

**Note:** Version bump only for package @entur/chip

## [0.3.11](https://github.com/entur/design-system/compare/@entur/chip@0.3.10...@entur/chip@0.3.11) (2020-04-23)

### Bug Fixes

- updated to use new focus styling where applicable ([d0a52c0](https://github.com/entur/design-system/commits/d0a52c096b673c6647070a90dd79bef9003ee0ad))

## [0.3.10](https://github.com/entur/design-system/compare/@entur/chip@0.3.9...@entur/chip@0.3.10) (2020-04-08)

**Note:** Version bump only for package @entur/chip

## [0.3.9](https://github.com/entur/design-system/compare/@entur/chip@0.3.7...@entur/chip@0.3.9) (2020-03-25)

**Note:** Version bump only for package @entur/chip

## [0.3.8](https://github.com/entur/design-system/compare/@entur/chip@0.3.7...@entur/chip@0.3.8) (2020-03-25)

**Note:** Version bump only for package @entur/chip

## [0.3.7](https://github.com/entur/design-system/compare/@entur/chip@0.3.6...@entur/chip@0.3.7) (2020-03-20)

**Note:** Version bump only for package @entur/chip

## [0.3.6](https://github.com/entur/design-system/compare/@entur/chip@0.3.5...@entur/chip@0.3.6) (2020-03-18)

**Note:** Version bump only for package @entur/chip

## [0.3.5](https://github.com/entur/design-system/compare/@entur/chip@0.3.4...@entur/chip@0.3.5) (2020-03-05)

**Note:** Version bump only for package @entur/chip

## [0.3.4](https://github.com/entur/design-system/compare/@entur/chip@0.3.3...@entur/chip@0.3.4) (2020-02-26)

**Note:** Version bump only for package @entur/chip

## [0.3.3](https://github.com/entur/design-system/compare/@entur/chip@0.3.2...@entur/chip@0.3.3) (2020-02-20)

**Note:** Version bump only for package @entur/chip

## [0.3.2](https://github.com/entur/design-system/compare/@entur/chip@0.3.1...@entur/chip@0.3.2) (2020-02-14)

**Note:** Version bump only for package @entur/chip

## [0.3.1](https://github.com/entur/design-system/compare/@entur/chip@0.3.0...@entur/chip@0.3.1) (2020-02-12)

**Note:** Version bump only for package @entur/chip

# [0.3.0](https://github.com/entur/design-system/compare/@entur/chip@0.2.14...@entur/chip@0.3.0) (2020-02-10)

### Features

- add new components: tagchip and filterchip ([9363b20](https://github.com/entur/design-system/commits/9363b204f04c8d10a2cee3a8076313b0800e027e))

## [0.2.14](https://github.com/entur/design-system/compare/@entur/chip@0.2.13...@entur/chip@0.2.14) (2020-02-05)

### Bug Fixes

- remove test-files from build process ([e0b24af](https://github.com/entur/design-system/commits/e0b24af05d5c2ad8de4ae587d83c389495235890))

## [0.2.13](https://github.com/entur/design-system/compare/@entur/chip@0.2.12...@entur/chip@0.2.13) (2020-01-31)

**Note:** Version bump only for package @entur/chip

## [0.2.12](https://github.com/entur/design-system/compare/@entur/chip@0.2.11...@entur/chip@0.2.12) (2020-01-28)

**Note:** Version bump only for package @entur/chip

## [0.2.11](https://github.com/entur/design-system/compare/@entur/chip@0.2.10...@entur/chip@0.2.11) (2020-01-27)

### Bug Fixes

- **types:** place types in the correct place ([acace09](https://github.com/entur/design-system/commits/acace09ec0e258c5cff3a65e13ab29d6603780d9))

## [0.2.10](https://github.com/entur/design-system/compare/@entur/chip@0.2.9...@entur/chip@0.2.10) (2020-01-20)

**Note:** Version bump only for package @entur/chip

## [0.2.9](https://github.com/entur/design-system/compare/@entur/chip@0.2.8...@entur/chip@0.2.9) (2020-01-14)

**Note:** Version bump only for package @entur/chip

## [0.2.8](https://github.com/entur/design-system/compare/@entur/chip@0.2.7...@entur/chip@0.2.8) (2020-01-13)

**Note:** Version bump only for package @entur/chip

## [0.2.7](https://github.com/entur/design-system/compare/@entur/chip@0.2.6...@entur/chip@0.2.7) (2020-01-10)

**Note:** Version bump only for package @entur/chip

## [0.2.6](https://github.com/entur/design-system/compare/@entur/chip@0.2.5...@entur/chip@0.2.6) (2020-01-08)

### Bug Fixes

- warn in development if the developer have forgotten the CSS ([e5c30fc](https://github.com/entur/design-system/commits/e5c30fc08624ef22c02773892778abd92205c6b0))

## [0.2.5](https://github.com/entur/design-system/compare/@entur/chip@0.2.4...@entur/chip@0.2.5) (2020-01-06)

**Note:** Version bump only for package @entur/chip

## [0.2.4](https://github.com/entur/design-system/compare/@entur/chip@0.2.3...@entur/chip@0.2.4) (2019-12-17)

**Note:** Version bump only for package @entur/chip

## [0.2.3](https://github.com/entur/design-system/compare/@entur/chip@0.2.2...@entur/chip@0.2.3) (2019-12-10)

### Bug Fixes

- decreasing min-width for chips to 48px ([fe273db](https://github.com/entur/design-system/commits/fe273dbd587a31514d852e743da564c2402ef13a))
- fixing label support for choice chips group ([8bebf95](https://github.com/entur/design-system/commits/8bebf9503ccb7dadd100fbd177b3da31a9375483))

## [0.2.2](https://github.com/entur/design-system/compare/@entur/chip@0.2.1...@entur/chip@0.2.2) (2019-12-10)

### Bug Fixes

- spreading styles on ChoiceChip-components ([4bdfef8](https://github.com/entur/design-system/commits/4bdfef86acdc29e3620a9b20792812672b58bfa6))
- **icon position:** consistent spacing for icons in chips ([f8ab91f](https://github.com/entur/design-system/commits/f8ab91f255e70f1945d7145e6aef7c5136232bc1))
- adding default prop as part of documentation ([1ef7510](https://github.com/entur/design-system/commits/1ef75107362f6262429d7fe31519b4353eccc8de))

## [0.2.1](https://github.com/entur/design-system/compare/@entur/chip@0.2.0...@entur/chip@0.2.1) (2019-11-29)

### Bug Fixes

- using new box shadow tokens ([9ff30bd](https://github.com/entur/design-system/commits/9ff30bd52ad2b6e6d770565684a05e15f0b0ba9a))

# [0.2.0](https://github.com/entur/design-system/compare/@entur/chip@0.1.1...@entur/chip@0.2.0) (2019-11-22)

### Features

- **types:** exporting all public types for public components ([4a277ab](https://github.com/entur/design-system/commits/4a277ab266fdb32a6760821a07b1c6cc716bac85))

## 0.1.1 (2019-11-18)

### Bug Fixes

- fixing improper styling of chips ([eb48017](https://github.com/entur/design-system/commits/eb48017876785665900062461470b35ef05a1e9f))
