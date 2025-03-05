# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.2.3](https://github.com/entur/design-system/compare/@entur/tooltip@5.2.2...@entur/tooltip@5.2.3) (2025-03-05)

**Note:** Version bump only for package @entur/tooltip

## [5.2.2](https://github.com/entur/design-system/compare/@entur/tooltip@5.2.1...@entur/tooltip@5.2.2) (2025-02-25)

**Note:** Version bump only for package @entur/tooltip

## [5.2.1](https://github.com/entur/design-system/compare/@entur/tooltip@5.2.0...@entur/tooltip@5.2.1) (2025-02-20)

**Note:** Version bump only for package @entur/tooltip

# [5.2.0](https://github.com/entur/design-system/compare/@entur/tooltip@5.1.6...@entur/tooltip@5.2.0) (2025-01-24)

### Features

- **tooltip:** replace focus with focus-visible ([aaf2574](https://github.com/entur/design-system/commit/aaf25747573a22bc732e4e45c36aa0d1c631a9c2))

## [5.1.6](https://github.com/entur/design-system/compare/@entur/tooltip@5.1.5...@entur/tooltip@5.1.6) (2025-01-15)

**Note:** Version bump only for package @entur/tooltip

## [5.1.5](https://github.com/entur/design-system/compare/@entur/tooltip@5.1.5-RC.0...@entur/tooltip@5.1.5) (2025-01-14)

**Note:** Version bump only for package @entur/tooltip

## [5.1.5-RC.0](https://github.com/entur/design-system/compare/@entur/tooltip@5.1.4...@entur/tooltip@5.1.5-RC.0) (2025-01-09)

**Note:** Version bump only for package @entur/tooltip

## [5.1.4](https://github.com/entur/design-system/compare/@entur/tooltip@5.1.3...@entur/tooltip@5.1.4) (2024-12-06)

### Performance Improvements

- **popover:** fix performance bug causing unnecessary rerenders ([d5c5117](https://github.com/entur/design-system/commit/d5c5117619778010503c91cdd6f18d8a4cdca9d2))
- **tooltip:** fix performance bug causing unnecessary rerenders ([07ffb01](https://github.com/entur/design-system/commit/07ffb017d04199dc58f59c65ae0fb21233bc8f3c))

## [5.1.3](https://github.com/entur/design-system/compare/@entur/tooltip@5.1.2...@entur/tooltip@5.1.3) (2024-11-20)

**Note:** Version bump only for package @entur/tooltip

## [5.1.2](https://github.com/entur/design-system/compare/@entur/tooltip@5.1.1...@entur/tooltip@5.1.2) (2024-11-12)

**Note:** Version bump only for package @entur/tooltip

## [5.1.1](https://github.com/entur/design-system/compare/@entur/tooltip@5.1.0...@entur/tooltip@5.1.1) (2024-10-23)

### Bug Fixes

- **tokens:** add [@forward](https://bitbucket.org/forward) export in scss stylesheets that import scss variabels ([7141592](https://github.com/entur/design-system/commits/71415926888eda23e02efaf98a611043f9fd9b2f))

# [5.1.0](https://github.com/entur/design-system/compare/@entur/tooltip@5.0.0...@entur/tooltip@5.1.0) (2024-10-16)

### Bug Fixes

- **tooltip:** fix isOpen-prop not behaving as intended ([551b25c](https://github.com/entur/design-system/commits/551b25c5e53655654dbcc3ceb3cdd7827808b01f))

### Features

- **tooltip:** add new prop hoverDelay to control delay for showing and hiding tooltip ([e124a70](https://github.com/entur/design-system/commits/e124a7021dbedef1c41b61382d6dbc22b36685df))
- **tooltip:** add onClickCloseButton prop ([9f986af](https://github.com/entur/design-system/commits/9f986afd46b6393df53220e69c05e49fa658d9bd))

# [5.0.0](https://github.com/entur/design-system/compare/@entur/tooltip@4.0.1...@entur/tooltip@5.0.0) (2024-10-03)

### Performance Improvements

- **overflow menu:** switch from @reach/menu to floating-ui for overflow menu functionality ([eebc701](https://github.com/entur/design-system/commits/eebc701c1683db6b2981d851b0832fa101c9e529))

### BREAKING CHANGES

- **overflow menu:** - position is deprecated in favor of placement. This is done to improve naming consistency

* onSelect is deprecated in overflowMenuLink, href should be used.
* as is removed from overflowMenuItem. Element is now based only on if item is an action or a link
* change from @reach/menu to floating-ui may lead to unknown changes, check where component is used

## [4.0.1](https://github.com/entur/design-system/compare/@entur/tooltip@4.0.0...@entur/tooltip@4.0.1) (2024-09-19)

**Note:** Version bump only for package @entur/tooltip

# [4.0.0](https://github.com/entur/design-system/compare/@entur/tooltip@3.0.2...@entur/tooltip@4.0.0) (2024-09-10)

### Performance Improvements

- **popover:** use floating-ui in popover instead of popper-js ([408b0f7](https://github.com/entur/design-system/commits/408b0f70d8ff0174dcdeedba9a228e3700bd6acb))
- **tooltip:** change from popper-js to floating-ui in Tooltip component ([fd6a86f](https://github.com/entur/design-system/commits/fd6a86ff5d85be6880f66bf33056eee40d206ed2))

### BREAKING CHANGES

- **tooltip:** popperModifiers prop is depracated and no longer works| Tooltip is now hidden via display: none in
  stead of removal from DOM.

## [3.0.2](https://github.com/entur/design-system/compare/@entur/tooltip@3.0.1...@entur/tooltip@3.0.2) (2024-08-28)

**Note:** Version bump only for package @entur/tooltip

## [3.0.1](https://github.com/entur/design-system/compare/@entur/tooltip@3.0.0...@entur/tooltip@3.0.1) (2024-08-12)

**Note:** Version bump only for package @entur/tooltip

# [3.0.0](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.11...@entur/tooltip@3.0.0) (2024-07-11)

### Features

- **tooltip:** add click and keyboard listner for tooltip ([4afc7f9](https://github.com/entur/design-system/commits/4afc7f920b9c7936db7442c83e625113e71df104))

### Performance Improvements

- **base form control:** simplify code structure of base form control ([ac7da6a](https://github.com/entur/design-system/commits/ac7da6a3c3caddddd71631736b2c6a69d3e192f5))

### BREAKING CHANGES

- **base form control:** Some wrappers have been removed and component structure is changed.|This could make previous
  overwritten styles no longer work as intended.|If you are changign internal styles, please make sure
  your UI works as expected

## [2.7.11](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.10...@entur/tooltip@2.7.11) (2024-07-11)

**Note:** Version bump only for package @entur/tooltip

## [2.7.10](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.9...@entur/tooltip@2.7.10) (2024-06-11)

### Bug Fixes

- **popover:** add correct border-radius ([74c1907](https://github.com/entur/design-system/commits/74c190737d4b50dc499d6d0eb22034a3c2dde25c))

## [2.7.9](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.8...@entur/tooltip@2.7.9) (2024-05-29)

**Note:** Version bump only for package @entur/tooltip

## [2.7.8](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.7...@entur/tooltip@2.7.8) (2024-05-21)

**Note:** Version bump only for package @entur/tooltip

## [2.7.7](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.6...@entur/tooltip@2.7.7) (2024-05-13)

**Note:** Version bump only for package @entur/tooltip

## [2.7.6](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.5...@entur/tooltip@2.7.6) (2024-05-07)

**Note:** Version bump only for package @entur/tooltip

## [2.7.5](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.4...@entur/tooltip@2.7.5) (2024-04-24)

**Note:** Version bump only for package @entur/tooltip

## [2.7.4](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.3...@entur/tooltip@2.7.4) (2024-04-22)

**Note:** Version bump only for package @entur/tooltip

## [2.7.3](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.2...@entur/tooltip@2.7.3) (2024-04-18)

**Note:** Version bump only for package @entur/tooltip

## [2.7.2](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.1...@entur/tooltip@2.7.2) (2024-04-18)

**Note:** Version bump only for package @entur/tooltip

## [2.7.1](https://github.com/entur/design-system/compare/@entur/tooltip@2.7.0...@entur/tooltip@2.7.1) (2024-04-12)

**Note:** Version bump only for package @entur/tooltip

# [2.7.0](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.52...@entur/tooltip@2.7.0) (2024-04-11)

### Features

- **tooltip:** add new VariantType and deprecate the old ones ([8e78884](https://github.com/entur/design-system/commits/8e788849a9767cdbba078f34e225bcf972cfe847))

## [2.6.52](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.51...@entur/tooltip@2.6.52) (2024-04-10)

### Bug Fixes

- migrate away from legacy tilde imports in sass ([cc16e7f](https://github.com/entur/design-system/commits/cc16e7f1a8d65143ab0dd583aea76b5ba11be148))

## [2.6.51](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.50...@entur/tooltip@2.6.51) (2024-03-27)

**Note:** Version bump only for package @entur/tooltip

## [2.6.50](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.49...@entur/tooltip@2.6.50) (2024-03-25)

**Note:** Version bump only for package @entur/tooltip

## [2.6.49](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.48...@entur/tooltip@2.6.49) (2024-03-21)

**Note:** Version bump only for package @entur/tooltip

## [2.6.48](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.47...@entur/tooltip@2.6.48) (2024-03-15)

**Note:** Version bump only for package @entur/tooltip

## [2.6.47](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.46...@entur/tooltip@2.6.47) (2024-03-06)

**Note:** Version bump only for package @entur/tooltip

## [2.6.46](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.45...@entur/tooltip@2.6.46) (2024-02-22)

**Note:** Version bump only for package @entur/tooltip

## [2.6.45](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.44...@entur/tooltip@2.6.45) (2024-02-12)

**Note:** Version bump only for package @entur/tooltip

## [2.6.44](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.43...@entur/tooltip@2.6.44) (2024-02-01)

**Note:** Version bump only for package @entur/tooltip

## [2.6.43](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.42...@entur/tooltip@2.6.43) (2024-01-24)

**Note:** Version bump only for package @entur/tooltip

## [2.6.42](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.41...@entur/tooltip@2.6.42) (2024-01-08)

**Note:** Version bump only for package @entur/tooltip

## [2.6.41](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.40...@entur/tooltip@2.6.41) (2023-12-22)

### Bug Fixes

- add missing type="button" to several buttons ([c5ddbac](https://github.com/entur/design-system/commits/c5ddbac0ec3043694708fe146df77619218cb240))

## [2.6.40](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.39...@entur/tooltip@2.6.40) (2023-12-18)

**Note:** Version bump only for package @entur/tooltip

## [2.6.39](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.38...@entur/tooltip@2.6.39) (2023-12-11)

**Note:** Version bump only for package @entur/tooltip

## [2.6.37](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.36...@entur/tooltip@2.6.37) (2023-12-04)

**Note:** Version bump only for package @entur/tooltip

## [2.6.36](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.35...@entur/tooltip@2.6.36) (2023-11-16)

**Note:** Version bump only for package @entur/tooltip

## [2.6.35](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.34...@entur/tooltip@2.6.35) (2023-10-30)

**Note:** Version bump only for package @entur/tooltip

## [2.6.34](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.33...@entur/tooltip@2.6.34) (2023-10-23)

**Note:** Version bump only for package @entur/tooltip

## [2.6.33](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.32...@entur/tooltip@2.6.33) (2023-10-11)

**Note:** Version bump only for package @entur/tooltip

## [2.6.32](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.31...@entur/tooltip@2.6.32) (2023-10-11)

**Note:** Version bump only for package @entur/tooltip

## [2.6.31](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.30...@entur/tooltip@2.6.31) (2023-10-06)

**Note:** Version bump only for package @entur/tooltip

## [2.6.30](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.29...@entur/tooltip@2.6.30) (2023-10-06)

**Note:** Version bump only for package @entur/tooltip

## [2.6.29](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.27...@entur/tooltip@2.6.29) (2023-09-25)

**Note:** Version bump only for package @entur/tooltip

## [2.6.28](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.27...@entur/tooltip@2.6.28) (2023-09-25)

**Note:** Version bump only for package @entur/tooltip

## [2.6.27](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.26...@entur/tooltip@2.6.27) (2023-09-08)

**Note:** Version bump only for package @entur/tooltip

## [2.6.26](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.25...@entur/tooltip@2.6.26) (2023-08-28)

**Note:** Version bump only for package @entur/tooltip

## [2.6.24](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.23...@entur/tooltip@2.6.24) (2023-08-10)

**Note:** Version bump only for package @entur/tooltip

## [2.6.23](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.22...@entur/tooltip@2.6.23) (2023-08-09)

**Note:** Version bump only for package @entur/tooltip

## [2.6.22](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.21...@entur/tooltip@2.6.22) (2023-07-19)

**Note:** Version bump only for package @entur/tooltip

## [2.6.21](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.20...@entur/tooltip@2.6.21) (2023-07-19)

**Note:** Version bump only for package @entur/tooltip

## [2.6.20](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.19...@entur/tooltip@2.6.20) (2023-07-18)

**Note:** Version bump only for package @entur/tooltip

## [2.6.19](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.18...@entur/tooltip@2.6.19) (2023-05-11)

**Note:** Version bump only for package @entur/tooltip

## [2.6.18](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.17...@entur/tooltip@2.6.18) (2023-04-24)

**Note:** Version bump only for package @entur/tooltip

## [2.6.17](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.16...@entur/tooltip@2.6.17) (2023-04-21)

**Note:** Version bump only for package @entur/tooltip

## [2.6.16](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.15...@entur/tooltip@2.6.16) (2023-04-17)

### Bug Fixes

- **tooltip:** fix aria-describedby pointing to non-existant element when tooltip is hidden ([a4e25ab](https://github.com/entur/design-system/commits/a4e25ab7cc2f078af57a87c99946574a8b394f8e))

## [2.6.15](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.12...@entur/tooltip@2.6.15) (2023-04-13)

**Note:** Version bump only for package @entur/tooltip

## [2.6.14](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.12...@entur/tooltip@2.6.14) (2023-04-05)

**Note:** Version bump only for package @entur/tooltip

## [2.6.13](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.12...@entur/tooltip@2.6.13) (2023-04-04)

**Note:** Version bump only for package @entur/tooltip

## [2.6.12](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.11...@entur/tooltip@2.6.12) (2023-04-03)

**Note:** Version bump only for package @entur/tooltip

## [2.6.11](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.10...@entur/tooltip@2.6.11) (2023-04-03)

**Note:** Version bump only for package @entur/tooltip

## [2.6.10](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.9...@entur/tooltip@2.6.10) (2023-03-27)

**Note:** Version bump only for package @entur/tooltip

## [2.6.9](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.8...@entur/tooltip@2.6.9) (2023-03-13)

**Note:** Version bump only for package @entur/tooltip

## [2.6.8](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.7...@entur/tooltip@2.6.8) (2023-03-07)

**Note:** Version bump only for package @entur/tooltip

## [2.6.7](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.6...@entur/tooltip@2.6.7) (2023-03-03)

**Note:** Version bump only for package @entur/tooltip

## [2.6.6](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.5...@entur/tooltip@2.6.6) (2023-02-17)

### Bug Fixes

- **tooltip:** prevent use react-popper >=2.3 to avoid react 18 related error ([9a866f8](https://github.com/entur/design-system/commits/9a866f81ff2ea6282a3b135abeada0aa48920891))

## [2.6.5](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.2...@entur/tooltip@2.6.5) (2023-02-17)

**Note:** Version bump only for package @entur/tooltip

## [2.6.4](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.2...@entur/tooltip@2.6.4) (2023-02-15)

**Note:** Version bump only for package @entur/tooltip

## [2.6.3](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.2...@entur/tooltip@2.6.3) (2023-02-09)

**Note:** Version bump only for package @entur/tooltip

## [2.6.2](https://github.com/entur/design-system/compare/@entur/tooltip@2.6.1...@entur/tooltip@2.6.2) (2023-02-02)

**Note:** Version bump only for package @entur/tooltip

# [2.6.0](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.24...@entur/tooltip@2.6.0) (2023-01-19)

### Features

- **popover:** add possibility to provide own state to popover component for semi-controlled functio ([8546735](https://github.com/entur/design-system/commits/854673585c6d3d0bca09950643fa8db7f33dc148))

## [2.5.24](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.21...@entur/tooltip@2.5.24) (2022-12-09)

**Note:** Version bump only for package @entur/tooltip

## [2.5.23](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.22...@entur/tooltip@2.5.23) (2022-11-24)

**Note:** Version bump only for package @entur/tooltip

## [2.5.22](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.21...@entur/tooltip@2.5.22) (2022-10-31)

**Note:** Version bump only for package @entur/tooltip

## [2.5.21](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.20...@entur/tooltip@2.5.21) (2022-10-31)

**Note:** Version bump only for package @entur/tooltip

## [2.5.20](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.19...@entur/tooltip@2.5.20) (2022-10-31)

**Note:** Version bump only for package @entur/tooltip

## [2.5.19](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.18...@entur/tooltip@2.5.19) (2022-10-20)

**Note:** Version bump only for package @entur/tooltip

## [2.5.18](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.17...@entur/tooltip@2.5.18) (2022-10-20)

**Note:** Version bump only for package @entur/tooltip

## [2.5.17](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.16...@entur/tooltip@2.5.17) (2022-10-12)

**Note:** Version bump only for package @entur/tooltip

## [2.5.15](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.14...@entur/tooltip@2.5.15) (2022-08-31)

**Note:** Version bump only for package @entur/tooltip

## [2.5.14](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.13...@entur/tooltip@2.5.14) (2022-08-24)

**Note:** Version bump only for package @entur/tooltip

## [2.5.13](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.12...@entur/tooltip@2.5.13) (2022-08-09)

**Note:** Version bump only for package @entur/tooltip

## [2.5.12](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.11...@entur/tooltip@2.5.12) (2022-07-05)

**Note:** Version bump only for package @entur/tooltip

## [2.5.11](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.10...@entur/tooltip@2.5.11) (2022-06-28)

**Note:** Version bump only for package @entur/tooltip

## [2.5.10](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.9...@entur/tooltip@2.5.10) (2022-06-24)

**Note:** Version bump only for package @entur/tooltip

## [2.5.9](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.8...@entur/tooltip@2.5.9) (2022-06-02)

**Note:** Version bump only for package @entur/tooltip

## [2.5.8](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.7...@entur/tooltip@2.5.8) (2022-05-13)

**Note:** Version bump only for package @entur/tooltip

## [2.5.7](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.6...@entur/tooltip@2.5.7) (2022-05-04)

**Note:** Version bump only for package @entur/tooltip

## [2.5.6](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.5...@entur/tooltip@2.5.6) (2022-04-27)

**Note:** Version bump only for package @entur/tooltip

## [2.5.5](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.4...@entur/tooltip@2.5.5) (2022-04-20)

**Note:** Version bump only for package @entur/tooltip

## [2.5.4](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.3...@entur/tooltip@2.5.4) (2022-04-19)

**Note:** Version bump only for package @entur/tooltip

## [2.5.3](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.2...@entur/tooltip@2.5.3) (2022-03-01)

**Note:** Version bump only for package @entur/tooltip

## [2.5.2](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.1...@entur/tooltip@2.5.2) (2022-02-09)

**Note:** Version bump only for package @entur/tooltip

## [2.5.1](https://github.com/entur/design-system/compare/@entur/tooltip@2.5.0...@entur/tooltip@2.5.1) (2022-01-05)

### Bug Fixes

- **popover:** popover will now close if focus is lost from a tab event ([d6991e3](https://github.com/entur/design-system/commits/d6991e37a1d129df84851d6634f8751cddea7aec))

# [2.5.0](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.27...@entur/tooltip@2.5.0) (2021-12-10)

### Features

- **tooltip:** add 'top-left' and 'top-right' option to placement prop ([6d62bf2](https://github.com/entur/design-system/commits/6d62bf2152418c380a4a0a12db1744c0ca65ed95))

## [2.4.27](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.26...@entur/tooltip@2.4.27) (2021-11-17)

**Note:** Version bump only for package @entur/tooltip

## [2.4.26](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.25...@entur/tooltip@2.4.26) (2021-09-23)

**Note:** Version bump only for package @entur/tooltip

## [2.4.25](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.24...@entur/tooltip@2.4.25) (2021-09-13)

**Note:** Version bump only for package @entur/tooltip

## [2.4.24](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.23...@entur/tooltip@2.4.24) (2021-09-07)

### Bug Fixes

- improve typings ([7232b23](https://github.com/entur/design-system/commits/7232b23dc60d6d403dd6d911570efecbc603e248))
- update dependency for package ([a53b795](https://github.com/entur/design-system/commits/a53b795f9bb4e40ced65fac60ed9a662af702303))

## [2.4.23](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.22...@entur/tooltip@2.4.23) (2021-08-13)

**Note:** Version bump only for package @entur/tooltip

## [2.4.22](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.21...@entur/tooltip@2.4.22) (2021-07-16)

**Note:** Version bump only for package @entur/tooltip

## [2.4.21](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.20...@entur/tooltip@2.4.21) (2021-06-25)

### Bug Fixes

- update dependencies ([011917c](https://github.com/entur/design-system/commits/011917cb4fb44bc89f8d4e346ce94ad6b1c8c643))
- **tooltip:** hide tooltip if content is falsy ([5a1dbae](https://github.com/entur/design-system/commits/5a1dbae105bdd964996773efb6b9d88418d6cda3))

## [2.4.20](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.19...@entur/tooltip@2.4.20) (2021-06-04)

**Note:** Version bump only for package @entur/tooltip

## [2.4.19](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.18...@entur/tooltip@2.4.19) (2021-05-19)

**Note:** Version bump only for package @entur/tooltip

## [2.4.18](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.17...@entur/tooltip@2.4.18) (2021-05-05)

**Note:** Version bump only for package @entur/tooltip

## [2.4.17](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.16...@entur/tooltip@2.4.17) (2021-04-23)

### Bug Fixes

- utilize new focus tokens ([17113ef](https://github.com/entur/design-system/commits/17113ef3f791c86fa6e19e71680fd5acdbae4990))

## [2.4.16](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.15...@entur/tooltip@2.4.16) (2021-04-09)

**Note:** Version bump only for package @entur/tooltip

## [2.4.15](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.14...@entur/tooltip@2.4.15) (2021-03-02)

**Note:** Version bump only for package @entur/tooltip

## [2.4.14](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.13...@entur/tooltip@2.4.14) (2021-02-17)

**Note:** Version bump only for package @entur/tooltip

## [2.4.13](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.12...@entur/tooltip@2.4.13) (2021-01-29)

**Note:** Version bump only for package @entur/tooltip

## [2.4.12](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.11...@entur/tooltip@2.4.12) (2021-01-20)

**Note:** Version bump only for package @entur/tooltip

## [2.4.11](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.10...@entur/tooltip@2.4.11) (2021-01-13)

### Bug Fixes

- **tooltip:** set maxwidth for tooltip ([fc5eba0](https://github.com/entur/design-system/commits/fc5eba02d44bf554505866e0367d779584cf53b4))
- transpose grey colors for updated color tokens ([d6a444c](https://github.com/entur/design-system/commits/d6a444c2c37339b9bac0702738ed52693367d344))
- update "attribute" typings for upgraded dependency ([0d5d661](https://github.com/entur/design-system/commits/0d5d6614af3326ef8d75525cac38a6cddd8ab9d2))
- update poppperjs dependency ([1ad19eb](https://github.com/entur/design-system/commits/1ad19eb025929f9c9632eeaeed932b815d304f57))

## [2.4.10](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.9...@entur/tooltip@2.4.10) (2021-01-05)

**Note:** Version bump only for package @entur/tooltip

## [2.4.9](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.8...@entur/tooltip@2.4.9) (2020-12-04)

**Note:** Version bump only for package @entur/tooltip

## [2.4.8](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.7...@entur/tooltip@2.4.8) (2020-11-10)

**Note:** Version bump only for package @entur/tooltip

## [2.4.7](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.6...@entur/tooltip@2.4.7) (2020-11-05)

**Note:** Version bump only for package @entur/tooltip

## [2.4.6](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.5...@entur/tooltip@2.4.6) (2020-10-28)

**Note:** Version bump only for package @entur/tooltip

## [2.4.5](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.4...@entur/tooltip@2.4.5) (2020-10-23)

**Note:** Version bump only for package @entur/tooltip

## [2.4.4](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.3...@entur/tooltip@2.4.4) (2020-10-16)

### Bug Fixes

- **popover:** fix event target check for Popovers inside a Shadow DOM ([5ada65f](https://github.com/entur/design-system/commits/5ada65f05c2a08ec23085919f8707db59a88dbfd))

## [2.4.3](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.2...@entur/tooltip@2.4.3) (2020-10-09)

**Note:** Version bump only for package @entur/tooltip

## [2.4.2](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.1...@entur/tooltip@2.4.2) (2020-09-25)

### Bug Fixes

- **tooltip:** fix import of dependency ([d625895](https://github.com/entur/design-system/commits/d625895db013fcb9339f79fbaea9bf3c80eccf9f))

## [2.4.1](https://github.com/entur/design-system/compare/@entur/tooltip@2.4.0...@entur/tooltip@2.4.1) (2020-09-14)

**Note:** Version bump only for package @entur/tooltip

# [2.4.0](https://github.com/entur/design-system/compare/@entur/tooltip@2.3.1...@entur/tooltip@2.4.0) (2020-09-10)

### Features

- **tooltip:** add poppermodifiers prop ([72d47d8](https://github.com/entur/design-system/commits/72d47d8a4c37443ef736abbe6e7abca649e0dcb7))

## [2.3.1](https://github.com/entur/design-system/compare/@entur/tooltip@2.3.0...@entur/tooltip@2.3.1) (2020-09-02)

### Bug Fixes

- **tooltip:** fix tooltip not closing after mouse exit ([c85af1f](https://github.com/entur/design-system/commits/c85af1fe7d8a38fab32d9b813fdb206e417f2428))
- **tooltip:** simplify mouse exit code, and improve tests ([1ad44c7](https://github.com/entur/design-system/commits/1ad44c729584ed9d7ce04aab9f71689d0d31f40b))

# [2.3.0](https://github.com/entur/design-system/compare/@entur/tooltip@2.2.5...@entur/tooltip@2.3.0) (2020-08-26)

### Features

- **tooltip:** add error variant for tooltip ([20a91e2](https://github.com/entur/design-system/commits/20a91e269344805c1cf0e64fb405009e2a297430))

## [2.2.5](https://github.com/entur/design-system/compare/@entur/tooltip@2.2.4...@entur/tooltip@2.2.5) (2020-08-19)

**Note:** Version bump only for package @entur/tooltip

## [2.2.4](https://github.com/entur/design-system/compare/@entur/tooltip@2.2.3...@entur/tooltip@2.2.4) (2020-08-11)

**Note:** Version bump only for package @entur/tooltip

## [2.2.3](https://github.com/entur/design-system/compare/@entur/tooltip@2.2.2...@entur/tooltip@2.2.3) (2020-07-24)

### Bug Fixes

- **popover:** add prevent default on button clicks ([0072ccd](https://github.com/entur/design-system/commits/0072ccd9f8dd2d4db158c4781eb7f35dd2cab163))

## [2.2.2](https://github.com/entur/design-system/compare/@entur/tooltip@2.2.1...@entur/tooltip@2.2.2) (2020-07-22)

**Note:** Version bump only for package @entur/tooltip

## [2.2.1](https://github.com/entur/design-system/compare/@entur/tooltip@2.2.0...@entur/tooltip@2.2.1) (2020-07-16)

### Bug Fixes

- fix typo in tooltip prop ([abbfc0b](https://github.com/entur/design-system/commits/abbfc0bcc6323e5baad2522e0b75b495c32bb121))
- improve internal handling of refs ([cbc2c29](https://github.com/entur/design-system/commits/cbc2c2957025618fcf692da4a894ff86765ed70e))

# [2.2.0](https://github.com/entur/design-system/compare/@entur/tooltip@2.1.5...@entur/tooltip@2.2.0) (2020-07-13)

### Bug Fixes

- fix contrast usage in popover component ([44b12bd](https://github.com/entur/design-system/commits/44b12bd6a43a620b392b24a369a6670dc30395a4))

### Features

- add new props for better controlability of tooltip ([decd962](https://github.com/entur/design-system/commits/decd962ef5c326fcbe5decdd4f3f0132b6e6930e))

## [2.1.5](https://github.com/entur/design-system/compare/@entur/tooltip@2.1.4...@entur/tooltip@2.1.5) (2020-07-09)

### Bug Fixes

- adjust popover content styling to be contrast ([4c43615](https://github.com/entur/design-system/commits/4c4361534ecc0064aabb1a22c1c0a8f0272e411f))

## [2.1.4](https://github.com/entur/design-system/compare/@entur/tooltip@2.1.3...@entur/tooltip@2.1.4) (2020-07-03)

**Note:** Version bump only for package @entur/tooltip

## [2.1.3](https://github.com/entur/design-system/compare/@entur/tooltip@2.1.2...@entur/tooltip@2.1.3) (2020-06-17)

### Bug Fixes

- fix wrong definition of forward referencing ([e5cad92](https://github.com/entur/design-system/commits/e5cad92c59bc6453ab4dbe9a18c4c7e42dd7e00d))

## [2.1.2](https://github.com/entur/design-system/compare/@entur/tooltip@2.1.1...@entur/tooltip@2.1.2) (2020-05-27)

**Note:** Version bump only for package @entur/tooltip

## [2.1.1](https://github.com/entur/design-system/compare/@entur/tooltip@2.1.0...@entur/tooltip@2.1.1) (2020-05-26)

### Bug Fixes

- fix missing styling for tooltip ([360a09d](https://github.com/entur/design-system/commits/360a09d1fa4d112922514f5e72db1bae82f9f6d7))

# [2.1.0](https://github.com/entur/design-system/compare/@entur/tooltip@2.0.6...@entur/tooltip@2.1.0) (2020-05-20)

### Bug Fixes

- reduce tooltip min width ([69f1188](https://github.com/entur/design-system/commits/69f118809747cade635c2cfa1b6e62eeece2f607))
- update tooltip component for breaking change in dependency ([1601ab7](https://github.com/entur/design-system/commits/1601ab79945a0a049ab25fa7d429a019ad454dee))

### Features

- **popover:** add popover component ([b692c95](https://github.com/entur/design-system/commits/b692c95c08cfc20368e9eda082bcb235339718d2))

## [2.0.6](https://github.com/entur/design-system/compare/@entur/tooltip@2.0.5...@entur/tooltip@2.0.6) (2020-04-27)

**Note:** Version bump only for package @entur/tooltip

## [2.0.5](https://github.com/entur/design-system/compare/@entur/tooltip@2.0.4...@entur/tooltip@2.0.5) (2020-04-23)

**Note:** Version bump only for package @entur/tooltip

## [2.0.4](https://github.com/entur/design-system/compare/@entur/tooltip@2.0.3...@entur/tooltip@2.0.4) (2020-04-08)

**Note:** Version bump only for package @entur/tooltip

## [2.0.3](https://github.com/entur/design-system/compare/@entur/tooltip@2.0.1...@entur/tooltip@2.0.3) (2020-03-25)

**Note:** Version bump only for package @entur/tooltip

## [2.0.2](https://github.com/entur/design-system/compare/@entur/tooltip@2.0.1...@entur/tooltip@2.0.2) (2020-03-25)

**Note:** Version bump only for package @entur/tooltip

## [2.0.1](https://github.com/entur/design-system/compare/@entur/tooltip@2.0.0...@entur/tooltip@2.0.1) (2020-03-20)

**Note:** Version bump only for package @entur/tooltip

# [2.0.0](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.10...@entur/tooltip@2.0.0) (2020-03-18)

### Bug Fixes

- improve api and functionality of tooltip ([4923622](https://github.com/entur/design-system/commits/4923622747e59215faa67113a35e5da92a74c771))
- rework tooltip component to increase usability ([6b27444](https://github.com/entur/design-system/commits/6b27444fbc18b975b721ee8a17936aa846b61baf))
- update styling of tooltips ([66f4863](https://github.com/entur/design-system/commits/66f48632340c31a20cbd82f46180b3e62183d722))

### Features

- improve tooltip ([879f0ce](https://github.com/entur/design-system/commits/879f0ce3d80facd3ace5e05fb5c06b26db987d3b))

### BREAKING CHANGES

- children must now be wrapped in an element to ensure accesibility

## [1.1.10](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.9...@entur/tooltip@1.1.10) (2020-02-20)

**Note:** Version bump only for package @entur/tooltip

## [1.1.9](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.8...@entur/tooltip@1.1.9) (2020-02-12)

### Bug Fixes

- fix missing type for spreading of props ([0e5beba](https://github.com/entur/design-system/commits/0e5beba82ea7dde39915cd626e665aa6c15dafbf))

## [1.1.8](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.7...@entur/tooltip@1.1.8) (2020-02-05)

### Bug Fixes

- remove test-files from build process ([e0b24af](https://github.com/entur/design-system/commits/e0b24af05d5c2ad8de4ae587d83c389495235890))

## [1.1.7](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.6...@entur/tooltip@1.1.7) (2020-01-28)

**Note:** Version bump only for package @entur/tooltip

## [1.1.6](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.5...@entur/tooltip@1.1.6) (2020-01-27)

### Bug Fixes

- **types:** place types in the correct place ([acace09](https://github.com/entur/design-system/commits/acace09ec0e258c5cff3a65e13ab29d6603780d9))

## [1.1.5](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.4...@entur/tooltip@1.1.5) (2020-01-14)

**Note:** Version bump only for package @entur/tooltip

## [1.1.4](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.3...@entur/tooltip@1.1.4) (2020-01-08)

### Bug Fixes

- warn in development if the developer have forgotten the CSS ([e5c30fc](https://github.com/entur/design-system/commits/e5c30fc08624ef22c02773892778abd92205c6b0))

## [1.1.3](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.2...@entur/tooltip@1.1.3) (2020-01-06)

**Note:** Version bump only for package @entur/tooltip

## [1.1.2](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.1...@entur/tooltip@1.1.2) (2019-12-10)

### Bug Fixes

- adding default prop as part of documentation ([1ef7510](https://github.com/entur/design-system/commits/1ef75107362f6262429d7fe31519b4353eccc8de))

## [1.1.1](https://github.com/entur/design-system/compare/@entur/tooltip@1.1.0...@entur/tooltip@1.1.1) (2019-11-29)

**Note:** Version bump only for package @entur/tooltip

# [1.1.0](https://github.com/entur/design-system/compare/@entur/tooltip@1.0.2...@entur/tooltip@1.1.0) (2019-11-22)

### Features

- **types:** exporting all public types for public components ([4a277ab](https://github.com/entur/design-system/commits/4a277ab266fdb32a6760821a07b1c6cc716bac85))

## [1.0.2](https://github.com/entur/design-system/compare/@entur/tooltip@1.0.1...@entur/tooltip@1.0.2) (2019-11-14)

### Bug Fixes

- **css classnames:** fixing naming collisions with CSS classes ([a93ca43](https://github.com/entur/design-system/commits/a93ca435d3a01d61d8f02694a672686b9e943a66))

## [1.0.1](https://github.com/entur/design-system/compare/@entur/tooltip@1.0.0...@entur/tooltip@1.0.1) (2019-10-30)

### Bug Fixes

- update all packages to use new tokens ([4847835](https://github.com/entur/design-system/commits/48478359b0e562ba828e06d9b5c57239316805c2))

# [1.0.0](https://github.com/entur/design-system/compare/@entur/tooltip@0.2.0...@entur/tooltip@1.0.0) (2019-10-22)

### Code Refactoring

- **tooltip:** use named exports instead of default exports ([ad487aa](https://github.com/entur/design-system/commits/ad487aa63a591fa979b7d57cb804426cc54ed3b7))

### BREAKING CHANGES

- **tooltip:** Change from default export to named export (Tooltip)

# 0.2.0 (2019-09-25)

### Bug Fixes

- added tooltip on child-focus ([df9921d](https://github.com/entur/design-system/commits/df9921d))

### Features

- **tooltip:** tooltip component added ([2c0b449](https://github.com/entur/design-system/commits/2c0b449))
