# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.1.3](https://github.com/entur/design-system/compare/@entur/menu@5.1.2...@entur/menu@5.1.3) (2025-03-05)

**Note:** Version bump only for package @entur/menu

## [5.1.2](https://github.com/entur/design-system/compare/@entur/menu@5.1.1...@entur/menu@5.1.2) (2025-02-25)

**Note:** Version bump only for package @entur/menu

## [5.1.1](https://github.com/entur/design-system/compare/@entur/menu@5.1.0...@entur/menu@5.1.1) (2025-02-20)

**Note:** Version bump only for package @entur/menu

# [5.1.0](https://github.com/entur/design-system/compare/@entur/menu@5.0.8...@entur/menu@5.1.0) (2025-01-24)

### Features

- **menu:** replace focus with focus-visible ([b8e086e](https://github.com/entur/design-system/commit/b8e086efc80e631e4a8fcb55401e1d4df97dbd6f))

## [5.0.8](https://github.com/entur/design-system/compare/@entur/menu@5.0.7...@entur/menu@5.0.8) (2025-01-15)

**Note:** Version bump only for package @entur/menu

## [5.0.7](https://github.com/entur/design-system/compare/@entur/menu@5.0.7-RC.0...@entur/menu@5.0.7) (2025-01-14)

**Note:** Version bump only for package @entur/menu

## [5.0.7-RC.0](https://github.com/entur/design-system/compare/@entur/menu@5.0.6...@entur/menu@5.0.7-RC.0) (2025-01-09)

**Note:** Version bump only for package @entur/menu

## [5.0.6](https://github.com/entur/design-system/compare/@entur/menu@5.0.5...@entur/menu@5.0.6) (2024-12-06)

### Performance Improvements

- **overflow menu:** fix performance bug causing unnecessary rerenders ([20ab2d2](https://github.com/entur/design-system/commit/20ab2d24adaa93e71c5f9b31c6194d99e0db9675))

## [5.0.5](https://github.com/entur/design-system/compare/@entur/menu@5.0.4...@entur/menu@5.0.5) (2024-11-20)

**Note:** Version bump only for package @entur/menu

## [5.0.4](https://github.com/entur/design-system/compare/@entur/menu@5.0.3...@entur/menu@5.0.4) (2024-11-12)

**Note:** Version bump only for package @entur/menu

## [5.0.3](https://github.com/entur/design-system/compare/@entur/menu@5.0.2...@entur/menu@5.0.3) (2024-10-23)

### Bug Fixes

- **tokens:** add [@forward](https://bitbucket.org/forward) export in scss stylesheets that import scss variabels ([7141592](https://github.com/entur/design-system/commits/71415926888eda23e02efaf98a611043f9fd9b2f))

## [5.0.2](https://github.com/entur/design-system/compare/@entur/menu@5.0.1...@entur/menu@5.0.2) (2024-10-16)

### Bug Fixes

- **overflow menu:** add missing type="button" to overfow menu buttons ([d41c5e8](https://github.com/entur/design-system/commits/d41c5e8cab0d452fa629a62c2a5601b9e29bc787))

## [5.0.1](https://github.com/entur/design-system/compare/@entur/menu@5.0.0...@entur/menu@5.0.1) (2024-10-03)

### Bug Fixes

- **menu:** add deprecated typescript type for 'as' in OverflowMenuItem ([f0175c3](https://github.com/entur/design-system/commits/f0175c3dc408cb486f42ad108a81e4baa4977d21))

# [5.0.0](https://github.com/entur/design-system/compare/@entur/menu@4.2.40...@entur/menu@5.0.0) (2024-10-03)

### Bug Fixes

- **overflow menu:** add aria roles and close menu on select ([a61fb05](https://github.com/entur/design-system/commits/a61fb0538b07841c267574f6c451a979b598fd67))

### Performance Improvements

- **overflow menu:** switch from @reach/menu to floating-ui for overflow menu functionality ([eebc701](https://github.com/entur/design-system/commits/eebc701c1683db6b2981d851b0832fa101c9e529))
- **pagination:** use overflow menu in pagination instead of custom component ([31d9839](https://github.com/entur/design-system/commits/31d983950fc7dd85ea6169c422a7adc6456cde19))

### BREAKING CHANGES

- **pagination:** - some classNames have changed. If you have overriden this component, make sure things look as
  expected.
- **overflow menu:** - position is deprecated in favor of placement. This is done to improve naming consistency

* onSelect is deprecated in overflowMenuLink, href should be used.
* as is removed from overflowMenuItem. Element is now based only on if item is an action or a link
* change from @reach/menu to floating-ui may lead to unknown changes, check where component is used

## [4.2.40](https://github.com/entur/design-system/compare/@entur/menu@4.2.39...@entur/menu@4.2.40) (2024-09-19)

**Note:** Version bump only for package @entur/menu

## [4.2.39](https://github.com/entur/design-system/compare/@entur/menu@4.2.38...@entur/menu@4.2.39) (2024-09-10)

**Note:** Version bump only for package @entur/menu

## [4.2.38](https://github.com/entur/design-system/compare/@entur/menu@4.2.37...@entur/menu@4.2.38) (2024-08-28)

**Note:** Version bump only for package @entur/menu

## [4.2.37](https://github.com/entur/design-system/compare/@entur/menu@4.2.36...@entur/menu@4.2.37) (2024-08-12)

**Note:** Version bump only for package @entur/menu

## [4.2.36](https://github.com/entur/design-system/compare/@entur/menu@4.2.35...@entur/menu@4.2.36) (2024-07-11)

**Note:** Version bump only for package @entur/menu

## [4.2.35](https://github.com/entur/design-system/compare/@entur/menu@4.2.34...@entur/menu@4.2.35) (2024-07-11)

**Note:** Version bump only for package @entur/menu

## [4.2.34](https://github.com/entur/design-system/compare/@entur/menu@4.2.33...@entur/menu@4.2.34) (2024-06-11)

**Note:** Version bump only for package @entur/menu

## [4.2.33](https://github.com/entur/design-system/compare/@entur/menu@4.2.32...@entur/menu@4.2.33) (2024-05-29)

**Note:** Version bump only for package @entur/menu

## [4.2.32](https://github.com/entur/design-system/compare/@entur/menu@4.2.31...@entur/menu@4.2.32) (2024-05-21)

**Note:** Version bump only for package @entur/menu

## [4.2.31](https://github.com/entur/design-system/compare/@entur/menu@4.2.30...@entur/menu@4.2.31) (2024-05-13)

**Note:** Version bump only for package @entur/menu

## [4.2.30](https://github.com/entur/design-system/compare/@entur/menu@4.2.29...@entur/menu@4.2.30) (2024-05-07)

**Note:** Version bump only for package @entur/menu

## [4.2.29](https://github.com/entur/design-system/compare/@entur/menu@4.2.28...@entur/menu@4.2.29) (2024-04-24)

**Note:** Version bump only for package @entur/menu

## [4.2.28](https://github.com/entur/design-system/compare/@entur/menu@4.2.27...@entur/menu@4.2.28) (2024-04-22)

**Note:** Version bump only for package @entur/menu

## [4.2.27](https://github.com/entur/design-system/compare/@entur/menu@4.2.26...@entur/menu@4.2.27) (2024-04-18)

**Note:** Version bump only for package @entur/menu

## [4.2.26](https://github.com/entur/design-system/compare/@entur/menu@4.2.25...@entur/menu@4.2.26) (2024-04-18)

**Note:** Version bump only for package @entur/menu

## [4.2.25](https://github.com/entur/design-system/compare/@entur/menu@4.2.24...@entur/menu@4.2.25) (2024-04-12)

**Note:** Version bump only for package @entur/menu

## [4.2.24](https://github.com/entur/design-system/compare/@entur/menu@4.2.23...@entur/menu@4.2.24) (2024-04-11)

**Note:** Version bump only for package @entur/menu

## [4.2.23](https://github.com/entur/design-system/compare/@entur/menu@4.2.22...@entur/menu@4.2.23) (2024-04-10)

### Bug Fixes

- migrate away from legacy tilde imports in sass ([cc16e7f](https://github.com/entur/design-system/commits/cc16e7f1a8d65143ab0dd583aea76b5ba11be148))
- **pagination:** fix typo in type declaration for numberOfResults ([93fff59](https://github.com/entur/design-system/commits/93fff593201e8c5ffe4666ee46e13856de00d9f4))

## [4.2.22](https://github.com/entur/design-system/compare/@entur/menu@4.2.21...@entur/menu@4.2.22) (2024-03-27)

**Note:** Version bump only for package @entur/menu

## [4.2.21](https://github.com/entur/design-system/compare/@entur/menu@4.2.20...@entur/menu@4.2.21) (2024-03-25)

**Note:** Version bump only for package @entur/menu

## [4.2.20](https://github.com/entur/design-system/compare/@entur/menu@4.2.19...@entur/menu@4.2.20) (2024-03-21)

### Bug Fixes

- **side navigation:** fix incorrect aria label on collapsed menu ([5cb2f22](https://github.com/entur/design-system/commits/5cb2f221564856567f5c95f8b6c4776ecc262c41))

## [4.2.19](https://github.com/entur/design-system/compare/@entur/menu@4.2.18...@entur/menu@4.2.19) (2024-03-15)

**Note:** Version bump only for package @entur/menu

## [4.2.18](https://github.com/entur/design-system/compare/@entur/menu@4.2.17...@entur/menu@4.2.18) (2024-03-06)

**Note:** Version bump only for package @entur/menu

## [4.2.17](https://github.com/entur/design-system/compare/@entur/menu@4.2.16...@entur/menu@4.2.17) (2024-02-22)

**Note:** Version bump only for package @entur/menu

## [4.2.16](https://github.com/entur/design-system/compare/@entur/menu@4.2.15...@entur/menu@4.2.16) (2024-02-12)

**Note:** Version bump only for package @entur/menu

## [4.2.15](https://github.com/entur/design-system/compare/@entur/menu@4.2.14...@entur/menu@4.2.15) (2024-02-01)

**Note:** Version bump only for package @entur/menu

## [4.2.14](https://github.com/entur/design-system/compare/@entur/menu@4.2.13...@entur/menu@4.2.14) (2024-01-24)

**Note:** Version bump only for package @entur/menu

## [4.2.13](https://github.com/entur/design-system/compare/@entur/menu@4.2.12...@entur/menu@4.2.13) (2024-01-08)

**Note:** Version bump only for package @entur/menu

## [4.2.12](https://github.com/entur/design-system/compare/@entur/menu@4.2.11...@entur/menu@4.2.12) (2024-01-02)

### Bug Fixes

- **stepper:** fix visual bugs on small screen widths ([e2517d9](https://github.com/entur/design-system/commits/e2517d988457c4590e3e79cd77b8b6e0f126b348))

## [4.2.11](https://github.com/entur/design-system/compare/@entur/menu@4.2.10...@entur/menu@4.2.11) (2023-12-22)

### Bug Fixes

- add missing type="button" to several buttons ([c5ddbac](https://github.com/entur/design-system/commits/c5ddbac0ec3043694708fe146df77619218cb240))

## [4.2.10](https://github.com/entur/design-system/compare/@entur/menu@4.2.9...@entur/menu@4.2.10) (2023-12-18)

**Note:** Version bump only for package @entur/menu

## [4.2.9](https://github.com/entur/design-system/compare/@entur/menu@4.2.8...@entur/menu@4.2.9) (2023-12-11)

**Note:** Version bump only for package @entur/menu

## [4.2.7](https://github.com/entur/design-system/compare/@entur/menu@4.2.6...@entur/menu@4.2.7) (2023-12-04)

**Note:** Version bump only for package @entur/menu

## [4.2.6](https://github.com/entur/design-system/compare/@entur/menu@4.2.5...@entur/menu@4.2.6) (2023-11-16)

**Note:** Version bump only for package @entur/menu

## [4.2.5](https://github.com/entur/design-system/compare/@entur/menu@4.2.4...@entur/menu@4.2.5) (2023-10-30)

**Note:** Version bump only for package @entur/menu

## [4.2.4](https://github.com/entur/design-system/compare/@entur/menu@4.2.3...@entur/menu@4.2.4) (2023-10-23)

**Note:** Version bump only for package @entur/menu

## [4.2.3](https://github.com/entur/design-system/compare/@entur/menu@4.2.2...@entur/menu@4.2.3) (2023-10-11)

**Note:** Version bump only for package @entur/menu

## [4.2.2](https://github.com/entur/design-system/compare/@entur/menu@4.2.1...@entur/menu@4.2.2) (2023-10-11)

**Note:** Version bump only for package @entur/menu

## [4.2.1](https://github.com/entur/design-system/compare/@entur/menu@4.2.0...@entur/menu@4.2.1) (2023-10-06)

**Note:** Version bump only for package @entur/menu

# [4.2.0](https://github.com/entur/design-system/compare/@entur/menu@4.1.52...@entur/menu@4.2.0) (2023-10-06)

### Features

- **stepper:** improve accessibility ([7f22374](https://github.com/entur/design-system/commits/7f223745fa2165fa10c1bf5efb113c686b471797))

## [4.1.52](https://github.com/entur/design-system/compare/@entur/menu@4.1.50...@entur/menu@4.1.52) (2023-09-25)

**Note:** Version bump only for package @entur/menu

## [4.1.51](https://github.com/entur/design-system/compare/@entur/menu@4.1.50...@entur/menu@4.1.51) (2023-09-25)

**Note:** Version bump only for package @entur/menu

## [4.1.50](https://github.com/entur/design-system/compare/@entur/menu@4.1.49...@entur/menu@4.1.50) (2023-09-08)

**Note:** Version bump only for package @entur/menu

## [4.1.49](https://github.com/entur/design-system/compare/@entur/menu@4.1.48...@entur/menu@4.1.49) (2023-08-28)

**Note:** Version bump only for package @entur/menu

## [4.1.47](https://github.com/entur/design-system/compare/@entur/menu@4.1.46...@entur/menu@4.1.47) (2023-08-10)

**Note:** Version bump only for package @entur/menu

## [4.1.46](https://github.com/entur/design-system/compare/@entur/menu@4.1.45...@entur/menu@4.1.46) (2023-08-09)

**Note:** Version bump only for package @entur/menu

## [4.1.45](https://github.com/entur/design-system/compare/@entur/menu@4.1.44...@entur/menu@4.1.45) (2023-07-19)

**Note:** Version bump only for package @entur/menu

## [4.1.44](https://github.com/entur/design-system/compare/@entur/menu@4.1.43...@entur/menu@4.1.44) (2023-07-19)

**Note:** Version bump only for package @entur/menu

## [4.1.43](https://github.com/entur/design-system/compare/@entur/menu@4.1.42...@entur/menu@4.1.43) (2023-07-18)

**Note:** Version bump only for package @entur/menu

## [4.1.42](https://github.com/entur/design-system/compare/@entur/menu@4.1.41...@entur/menu@4.1.42) (2023-05-11)

**Note:** Version bump only for package @entur/menu

## [4.1.41](https://github.com/entur/design-system/compare/@entur/menu@4.1.40...@entur/menu@4.1.41) (2023-04-24)

**Note:** Version bump only for package @entur/menu

## [4.1.40](https://github.com/entur/design-system/compare/@entur/menu@4.1.39...@entur/menu@4.1.40) (2023-04-21)

**Note:** Version bump only for package @entur/menu

## [4.1.39](https://github.com/entur/design-system/compare/@entur/menu@4.1.38...@entur/menu@4.1.39) (2023-04-17)

**Note:** Version bump only for package @entur/menu

## [4.1.38](https://github.com/entur/design-system/compare/@entur/menu@4.1.35...@entur/menu@4.1.38) (2023-04-13)

### Bug Fixes

- **pagination:** fix duplicate word and indicate when on last page for screen readers ([f290181](https://github.com/entur/design-system/commits/f2901815ad41329117d0451c26ef2753d839b5ef))

## [4.1.37](https://github.com/entur/design-system/compare/@entur/menu@4.1.35...@entur/menu@4.1.37) (2023-04-05)

**Note:** Version bump only for package @entur/menu

## [4.1.36](https://github.com/entur/design-system/compare/@entur/menu@4.1.35...@entur/menu@4.1.36) (2023-04-04)

**Note:** Version bump only for package @entur/menu

## [4.1.35](https://github.com/entur/design-system/compare/@entur/menu@4.1.34...@entur/menu@4.1.35) (2023-04-03)

**Note:** Version bump only for package @entur/menu

## [4.1.34](https://github.com/entur/design-system/compare/@entur/menu@4.1.33...@entur/menu@4.1.34) (2023-04-03)

**Note:** Version bump only for package @entur/menu

## [4.1.33](https://github.com/entur/design-system/compare/@entur/menu@4.1.32...@entur/menu@4.1.33) (2023-03-27)

**Note:** Version bump only for package @entur/menu

## [4.1.32](https://github.com/entur/design-system/compare/@entur/menu@4.1.31...@entur/menu@4.1.32) (2023-03-13)

**Note:** Version bump only for package @entur/menu

## [4.1.31](https://github.com/entur/design-system/compare/@entur/menu@4.1.30...@entur/menu@4.1.31) (2023-03-07)

**Note:** Version bump only for package @entur/menu

## [4.1.30](https://github.com/entur/design-system/compare/@entur/menu@4.1.29...@entur/menu@4.1.30) (2023-03-03)

**Note:** Version bump only for package @entur/menu

## [4.1.29](https://github.com/entur/design-system/compare/@entur/menu@4.1.28...@entur/menu@4.1.29) (2023-02-20)

### Bug Fixes

- **menu:** fix broken styling for side navigation in contrast mode ([7664009](https://github.com/entur/design-system/commits/76640091f48a41734e87d5dfee272c2532f3ef27))

## [4.1.28](https://github.com/entur/design-system/compare/@entur/menu@4.1.24...@entur/menu@4.1.28) (2023-02-17)

**Note:** Version bump only for package @entur/menu

## [4.1.27](https://github.com/entur/design-system/compare/@entur/menu@4.1.24...@entur/menu@4.1.27) (2023-02-15)

**Note:** Version bump only for package @entur/menu

## [4.1.26](https://github.com/entur/design-system/compare/@entur/menu@4.1.24...@entur/menu@4.1.26) (2023-02-15)

**Note:** Version bump only for package @entur/menu

## [4.1.25](https://github.com/entur/design-system/compare/@entur/menu@4.1.24...@entur/menu@4.1.25) (2023-02-09)

**Note:** Version bump only for package @entur/menu

## [4.1.24](https://github.com/entur/design-system/compare/@entur/menu@4.1.23...@entur/menu@4.1.24) (2023-02-02)

**Note:** Version bump only for package @entur/menu

## [4.1.22](https://github.com/entur/design-system/compare/@entur/menu@4.1.21...@entur/menu@4.1.22) (2023-01-19)

### Performance Improvements

- **packages:** remove all referenves to react-polymorphic-types npm-package ([e47a304](https://github.com/entur/design-system/commits/e47a304d87eb77adae5dd002e89f03026c7eadce))

## [4.1.21](https://github.com/entur/design-system/compare/@entur/menu@4.1.20...@entur/menu@4.1.21) (2022-12-14)

### Bug Fixes

- **stepper:** fix broken showStepperIndex prop ([b85a9a2](https://github.com/entur/design-system/commits/b85a9a2cfd05caab60ba6f242ee488f5db71ad81))

## [4.1.20](https://github.com/entur/design-system/compare/@entur/menu@4.1.17...@entur/menu@4.1.20) (2022-12-09)

**Note:** Version bump only for package @entur/menu

## [4.1.19](https://github.com/entur/design-system/compare/@entur/menu@4.1.18...@entur/menu@4.1.19) (2022-11-24)

**Note:** Version bump only for package @entur/menu

## [4.1.18](https://github.com/entur/design-system/compare/@entur/menu@4.1.17...@entur/menu@4.1.18) (2022-10-31)

**Note:** Version bump only for package @entur/menu

## [4.1.17](https://github.com/entur/design-system/compare/@entur/menu@4.1.16...@entur/menu@4.1.17) (2022-10-31)

**Note:** Version bump only for package @entur/menu

## [4.1.16](https://github.com/entur/design-system/compare/@entur/menu@4.1.15...@entur/menu@4.1.16) (2022-10-31)

**Note:** Version bump only for package @entur/menu

## [4.1.15](https://github.com/entur/design-system/compare/@entur/menu@4.1.14...@entur/menu@4.1.15) (2022-10-20)

**Note:** Version bump only for package @entur/menu

## [4.1.14](https://github.com/entur/design-system/compare/@entur/menu@4.1.13...@entur/menu@4.1.14) (2022-10-20)

## [4.1.14-RC.2](https://github.com/entur/design-system/compare/@entur/menu@4.1.14-RC.1...@entur/menu@4.1.14-RC.2) (2022-11-22)

**Note:** Version bump only for package @entur/menu

## [4.1.14-RC.1](https://github.com/entur/design-system/compare/@entur/menu@4.1.14-RC.0...@entur/menu@4.1.14-RC.1) (2022-11-21)

**Note:** Version bump only for package @entur/menu

## [4.1.14-RC.0](https://github.com/entur/design-system/compare/@entur/menu@4.1.14-alpha.1...@entur/menu@4.1.14-RC.0) (2022-11-21)

**Note:** Version bump only for package @entur/menu

## [4.1.14-alpha.1](https://github.com/entur/design-system/compare/@entur/menu@4.1.14-alpha.0...@entur/menu@4.1.14-alpha.1) (2022-10-26)

**Note:** Version bump only for package @entur/menu

## [4.1.14-alpha.0](https://github.com/entur/design-system/compare/@entur/menu@4.1.13...@entur/menu@4.1.14-alpha.0) (2022-10-20)

**Note:** Version bump only for package @entur/menu

## [4.1.13](https://github.com/entur/design-system/compare/@entur/menu@4.1.12...@entur/menu@4.1.13) (2022-10-12)

**Note:** Version bump only for package @entur/menu

## [4.1.12](https://github.com/entur/design-system/compare/@entur/menu@4.1.11...@entur/menu@4.1.12) (2022-10-05)

### Bug Fixes

- **menu:** add missing warning about styles from @entur/a11y ([bd7265f](https://github.com/entur/design-system/commits/bd7265feab5a96039847b72728e203ae92f7e9a2))

## [4.1.10](https://github.com/entur/design-system/compare/@entur/menu@4.1.9...@entur/menu@4.1.10) (2022-09-02)

### Bug Fixes

- **collapsible side navigation:** add descriptive aria-label to open/close side navigation button ([a6a5faf](https://github.com/entur/design-system/commits/a6a5faf697123ca350e2c6df8e12bb4f27fdc7ad))
- **side navigation:** add descriptive label for side navigation group ([bd35115](https://github.com/entur/design-system/commits/bd351153e651e042aff04c7616ac2af4cc18901d))
- **side navigation item:** add aria-current=page to active side navigation item ([6b8f499](https://github.com/entur/design-system/commits/6b8f499184ee69c6d5dc1505a8dc866691ee577a))
- **side navigation item:** add descriptive aria-label to side navigation item when icon is used ([0757134](https://github.com/entur/design-system/commits/0757134121d9e78e401b3a05c277e7da67280486))
- **side navigation item:** add not-allowed cursor style to disabled navigation items ([a071782](https://github.com/entur/design-system/commits/a07178257a9ce41b37f162314b48674f77351197))
- **Stepper:** add more descriptive labels for screenreaders ([5077da7](https://github.com/entur/design-system/commits/5077da73d4add7e244641026dab49ba4f49d1125))

## [4.1.9](https://github.com/entur/design-system/compare/@entur/menu@4.1.8...@entur/menu@4.1.9) (2022-08-31)

**Note:** Version bump only for package @entur/menu

## [4.1.8](https://github.com/entur/design-system/compare/@entur/menu@4.1.7...@entur/menu@4.1.8) (2022-08-31)

### Bug Fixes

- **pagination:** add more descriptive screen reader texts to pagintion ([7673059](https://github.com/entur/design-system/commits/7673059920e94c75ff4e15c24feced7557a59676))

## [4.1.7](https://github.com/entur/design-system/compare/@entur/menu@4.1.6...@entur/menu@4.1.7) (2022-08-24)

### Bug Fixes

- add parameter and return types ([861b878](https://github.com/entur/design-system/commits/861b8782b1fae34242d64371a8af7887ac545df6))

## [4.1.6](https://github.com/entur/design-system/compare/@entur/menu@4.1.5...@entur/menu@4.1.6) (2022-08-09)

**Note:** Version bump only for package @entur/menu

## [4.1.5](https://github.com/entur/design-system/compare/@entur/menu@4.1.4...@entur/menu@4.1.5) (2022-07-05)

**Note:** Version bump only for package @entur/menu

## [4.1.4](https://github.com/entur/design-system/compare/@entur/menu@4.1.3...@entur/menu@4.1.4) (2022-06-28)

**Note:** Version bump only for package @entur/menu

## [4.1.3](https://github.com/entur/design-system/compare/@entur/menu@4.1.2...@entur/menu@4.1.3) (2022-06-24)

**Note:** Version bump only for package @entur/menu

## [4.1.2](https://github.com/entur/design-system/compare/@entur/menu@4.1.1...@entur/menu@4.1.2) (2022-06-02)

**Note:** Version bump only for package @entur/menu

## [4.1.1](https://github.com/entur/design-system/compare/@entur/menu@4.1.0...@entur/menu@4.1.1) (2022-05-13)

### Bug Fixes

- **pagination:** fix lint errors for react hooks ([937c18e](https://github.com/entur/design-system/commits/937c18ea4e595b520024af7d42944d612b5b471d))

# [4.1.0](https://github.com/entur/design-system/compare/@entur/menu@4.0.10...@entur/menu@4.1.0) (2022-05-04)

### Features

- **pagination:** change how page entries are displayed and make pagination wrap on smaller screens ([ce27211](https://github.com/entur/design-system/commits/ce27211aa2970f517eac3127a926215485236c5e))

## [4.0.10](https://github.com/entur/design-system/compare/@entur/menu@4.0.9...@entur/menu@4.0.10) (2022-04-27)

**Note:** Version bump only for package @entur/menu

## [4.0.9](https://github.com/entur/design-system/compare/@entur/menu@4.0.8...@entur/menu@4.0.9) (2022-04-20)

**Note:** Version bump only for package @entur/menu

## [4.0.8](https://github.com/entur/design-system/compare/@entur/menu@4.0.7...@entur/menu@4.0.8) (2022-04-19)

**Note:** Version bump only for package @entur/menu

## [4.0.7](https://github.com/entur/design-system/compare/@entur/menu@4.0.6...@entur/menu@4.0.7) (2022-03-01)

**Note:** Version bump only for package @entur/menu

## [4.0.6](https://github.com/entur/design-system/compare/@entur/menu@4.0.5...@entur/menu@4.0.6) (2022-02-09)

**Note:** Version bump only for package @entur/menu

## [4.0.5](https://github.com/entur/design-system/compare/@entur/menu@4.0.4...@entur/menu@4.0.5) (2021-11-17)

**Note:** Version bump only for package @entur/menu

## [4.0.4](https://github.com/entur/design-system/compare/@entur/menu@4.0.3...@entur/menu@4.0.4) (2021-10-18)

### Bug Fixes

- **pagination:** improve focus styling ([0e42eca](https://github.com/entur/design-system/commits/0e42eca9f5afcf94c7d4170b0d0df50ce8540ffc))

## [4.0.3](https://github.com/entur/design-system/compare/@entur/menu@4.0.2...@entur/menu@4.0.3) (2021-09-23)

### Bug Fixes

- **sidenavigation:** fix focus styling for components ([755ddf8](https://github.com/entur/design-system/commits/755ddf8393020eaadacaddcb33077d573365e652))

## [4.0.2](https://github.com/entur/design-system/compare/@entur/menu@4.0.1...@entur/menu@4.0.2) (2021-09-13)

### Bug Fixes

- **overflowmenu:** fix position bug in flex-box environments ([a244c91](https://github.com/entur/design-system/commits/a244c91547ec227db97675d60936b3de81925a5d))
- **overflowmenu item:** center align content properly ([fba5b6f](https://github.com/entur/design-system/commits/fba5b6f10fde5aa82eec992d8a4f4e70c3f8d8b3))

## [4.0.1](https://github.com/entur/design-system/compare/@entur/menu@4.0.0...@entur/menu@4.0.1) (2021-09-07)

### Bug Fixes

- fix lint warnings ([c4d620e](https://github.com/entur/design-system/commits/c4d620ebc008527beb22dd2cd553799cb053960c))
- update dependencies ([3dfc73e](https://github.com/entur/design-system/commits/3dfc73eaf90d0fccdb041adfe98c8a26ada0c47a))
- utilize reworked focus token ([586758f](https://github.com/entur/design-system/commits/586758fc86eb5aa52116c63c14ef033eb2e8b12f))

# [4.0.0](https://github.com/entur/design-system/compare/@entur/menu@3.6.6...@entur/menu@4.0.0) (2021-08-13)

### Bug Fixes

- **stepper:** make interactive prop false by default ([e6a89a3](https://github.com/entur/design-system/commits/e6a89a33ae348f43e7fe2821f86159f0d6cfb09d))

### Features

- **overflow menu:** add position prop for component ([58254ab](https://github.com/entur/design-system/commits/58254ab10b1385a175318ebc4ed5cf829b5dbd95))

### BREAKING CHANGES

- **stepper:** interactive prop has flipped is default state.
  if not provided, add interactive={true} to your component

## [3.6.6](https://github.com/entur/design-system/compare/@entur/menu@3.6.5...@entur/menu@3.6.6) (2021-07-16)

### Bug Fixes

- **pagination:** add small right margin to results label ([0a810c1](https://github.com/entur/design-system/commits/0a810c1f134675713078643038df2caf88b39baa))

## [3.6.5](https://github.com/entur/design-system/compare/@entur/menu@3.6.4...@entur/menu@3.6.5) (2021-06-25)

### Bug Fixes

- update dependencies ([eabf934](https://github.com/entur/design-system/commits/eabf934928ed4fdb56153c02620871bc3f2e5e6e))

## [3.6.4](https://github.com/entur/design-system/compare/@entur/menu@3.6.3...@entur/menu@3.6.4) (2021-06-04)

**Note:** Version bump only for package @entur/menu

## [3.6.3](https://github.com/entur/design-system/compare/@entur/menu@3.6.2...@entur/menu@3.6.3) (2021-05-19)

**Note:** Version bump only for package @entur/menu

## [3.6.2](https://github.com/entur/design-system/compare/@entur/menu@3.6.1...@entur/menu@3.6.2) (2021-05-05)

**Note:** Version bump only for package @entur/menu

## [3.6.1](https://github.com/entur/design-system/compare/@entur/menu@3.6.0...@entur/menu@3.6.1) (2021-04-23)

### Bug Fixes

- utilize new focus tokens ([17113ef](https://github.com/entur/design-system/commits/17113ef3f791c86fa6e19e71680fd5acdbae4990))

# [3.6.0](https://github.com/entur/design-system/compare/@entur/menu@3.5.6...@entur/menu@3.6.0) (2021-04-09)

### Features

- **overflowmenu:** add disabled prop ([34b1431](https://github.com/entur/design-system/commits/34b1431d20019b9fc066494492b49b34a745edc1))

## [3.5.6](https://github.com/entur/design-system/compare/@entur/menu@3.5.5...@entur/menu@3.5.6) (2021-03-02)

### Bug Fixes

- **overflowmenu:** remove portal usage ([b3353dc](https://github.com/entur/design-system/commits/b3353dcb810df388a30a215e86995f1f3e33e297))

## [3.5.5](https://github.com/entur/design-system/compare/@entur/menu@3.5.4...@entur/menu@3.5.5) (2021-02-17)

### Bug Fixes

- **polymorphism:** update polymorphism dependency ([dc4c31d](https://github.com/entur/design-system/commits/dc4c31d8e891a46c1f0c1fbd0a6a026c1638accc))
- add entur button to dependencies ([5ed4e89](https://github.com/entur/design-system/commits/5ed4e89fedc0c2a4f5ac4ff17f3cb0d091e345eb))

## [3.5.4](https://github.com/entur/design-system/compare/@entur/menu@3.5.3...@entur/menu@3.5.4) (2021-01-29)

### Bug Fixes

- **pagination:** update styling for active pagination page ([691dd0a](https://github.com/entur/design-system/commits/691dd0af5ed6917398f2cb0b5453d5d97ec4a46d))
- **topnavigationitem:** add styling for hover state ([f245e65](https://github.com/entur/design-system/commits/f245e65ea5f53deb83460737c99582ed2c19d633))

## [3.5.3](https://github.com/entur/design-system/compare/@entur/menu@3.5.2...@entur/menu@3.5.3) (2021-01-20)

**Note:** Version bump only for package @entur/menu

## [3.5.2](https://github.com/entur/design-system/compare/@entur/menu@3.5.1...@entur/menu@3.5.2) (2021-01-13)

### Bug Fixes

- transpose grey colors for updated color tokens ([d6a444c](https://github.com/entur/design-system/commits/d6a444c2c37339b9bac0702738ed52693367d344))
- update dependency ([ced744f](https://github.com/entur/design-system/commits/ced744f939ad05d530a483340dc33f6085d100ec))

## [3.5.1](https://github.com/entur/design-system/compare/@entur/menu@3.5.0...@entur/menu@3.5.1) (2021-01-05)

**Note:** Version bump only for package @entur/menu

# [3.5.0](https://github.com/entur/design-system/compare/@entur/menu@3.4.2...@entur/menu@3.5.0) (2020-12-04)

### Bug Fixes

- **overflowmenu:** improve typings ([3a96a84](https://github.com/entur/design-system/commits/3a96a843c3cc74a510f9b4ff8e3e83cb7f9c18ed))
- **overflowmenu:** increase z index ([5493a9f](https://github.com/entur/design-system/commits/5493a9fcadf73522dab5d1c2900d52ea11b7f965))

### Features

- **breadcrumb:** add support for polymorphic component typing ([ebea507](https://github.com/entur/design-system/commits/ebea507f73d37055151731ca4ca55d345a43a160))
- **sidenavigation:** add support for polymorphic component typing ([4913760](https://github.com/entur/design-system/commits/491376061de45dd03fb0be3568cce63b700a39a2))
- **topnavigationitem:** add support for polymorphic typings ([b188349](https://github.com/entur/design-system/commits/b18834915b5b8dd4f7859749fc4229aad3e11937))

## [3.4.2](https://github.com/entur/design-system/compare/@entur/menu@3.4.1...@entur/menu@3.4.2) (2020-11-10)

**Note:** Version bump only for package @entur/menu

## [3.4.1](https://github.com/entur/design-system/compare/@entur/menu@3.4.0...@entur/menu@3.4.1) (2020-11-05)

**Note:** Version bump only for package @entur/menu

# [3.4.0](https://github.com/entur/design-system/compare/@entur/menu@3.3.0...@entur/menu@3.4.0) (2020-10-28)

### Bug Fixes

- **sidenavigationitem:** adjust height ([cc3c7d8](https://github.com/entur/design-system/commits/cc3c7d85ff1e87fbf650d1dfc70efd8a7d025afc))

### Features

- **pagination:** add prop for resultsPerPage label ([b58f936](https://github.com/entur/design-system/commits/b58f93634a04216d4d2a278b3e21a648ec154e00))

# [3.3.0](https://github.com/entur/design-system/compare/@entur/menu@3.2.0...@entur/menu@3.3.0) (2020-10-23)

### Bug Fixes

- **breadcrumb:** add underline for breadcrumb items ([b9012cd](https://github.com/entur/design-system/commits/b9012cdd3780b825858e3a9e5fec938c8b7fbe48))

### Features

- **paginnation:** add showingresultslabel prop ([63cf5a1](https://github.com/entur/design-system/commits/63cf5a14f79020e47f7395aa87fc182ba4a4136e))

# [3.2.0](https://github.com/entur/design-system/compare/@entur/menu@3.1.4...@entur/menu@3.2.0) (2020-10-16)

### Bug Fixes

- **overflowmenu:** adjust height of menu items ([a00bac0](https://github.com/entur/design-system/commits/a00bac0909e07c626b9d4ea8c117bb541a77d519))

### Features

- **pagination:** add hide next/prev button prop ([9e148e3](https://github.com/entur/design-system/commits/9e148e3f4edbb72a78656f02ecfc98d55ca96287))

## [3.1.4](https://github.com/entur/design-system/compare/@entur/menu@3.1.3...@entur/menu@3.1.4) (2020-10-09)

**Note:** Version bump only for package @entur/menu

## [3.1.3](https://github.com/entur/design-system/compare/@entur/menu@3.1.2...@entur/menu@3.1.3) (2020-09-25)

**Note:** Version bump only for package @entur/menu

## [3.1.2](https://github.com/entur/design-system/compare/@entur/menu@3.1.1...@entur/menu@3.1.2) (2020-09-14)

### Bug Fixes

- **collapsiblesidenavigation:** remove auto closing of menu group ([180081e](https://github.com/entur/design-system/commits/180081e22f8b872fb9902849d37835c4e2f463fc))

## [3.1.1](https://github.com/entur/design-system/compare/@entur/menu@3.1.0...@entur/menu@3.1.1) (2020-09-10)

### Bug Fixes

- **collapsiblesidenavigation:** improve collapse functionality ([619f352](https://github.com/entur/design-system/commits/619f3523396ecc09ec0099eae2322a662978eda9))
- **sidenavigation:** adjust border-color and position ([63a151a](https://github.com/entur/design-system/commits/63a151a54ac98cd458c07d1cefcf21eabfb6275a))

# [3.1.0](https://github.com/entur/design-system/compare/@entur/menu@3.0.5...@entur/menu@3.1.0) (2020-09-02)

### Bug Fixes

- **pagination:** fix width for pagination with high pagecount ([d01d44d](https://github.com/entur/design-system/commits/d01d44d7a64032f476adeb5c2d8e6de2d857d59a))
- **pagination:** shift font size for new token ([5538ff3](https://github.com/entur/design-system/commits/5538ff30ed226e123fee5be6b2c036499b824f3c))
- **stepper:** fix stepper arrow edge ([0e37499](https://github.com/entur/design-system/commits/0e37499bdd7da55d768f9f4f6e5ea720c0530713))

### Features

- **stepper:** add prop showstepperindex ([48b3f25](https://github.com/entur/design-system/commits/48b3f256691e377b719ae1250b76af16f12b6445))

## [3.0.5](https://github.com/entur/design-system/compare/@entur/menu@3.0.4...@entur/menu@3.0.5) (2020-08-26)

**Note:** Version bump only for package @entur/menu

## [3.0.4](https://github.com/entur/design-system/compare/@entur/menu@3.0.3...@entur/menu@3.0.4) (2020-08-19)

**Note:** Version bump only for package @entur/menu

## [3.0.3](https://github.com/entur/design-system/compare/@entur/menu@3.0.2...@entur/menu@3.0.3) (2020-08-14)

**Note:** Version bump only for package @entur/menu

## [3.0.2](https://github.com/entur/design-system/compare/@entur/menu@3.0.1...@entur/menu@3.0.2) (2020-08-11)

### Bug Fixes

- **sidenavigation:** adjust fontweight and margin for sidenavigation ([8f9618b](https://github.com/entur/design-system/commits/8f9618b4ba82edc6d53dff62ae6a07128594d757))

## [3.0.1](https://github.com/entur/design-system/compare/@entur/menu@3.0.0...@entur/menu@3.0.1) (2020-07-24)

### Bug Fixes

- **pagination:** improve prop description ([64e7cd4](https://github.com/entur/design-system/commits/64e7cd47381f99715b0ab95deb6a4a1ce4836a1e))

# [3.0.0](https://github.com/entur/design-system/compare/@entur/menu@2.0.0...@entur/menu@3.0.0) (2020-07-22)

### Bug Fixes

- **breadcrumb:** fix padding between breadcrumb items ([357625a](https://github.com/entur/design-system/commits/357625a4f2a321df247e240590f3bd5a2be4ef45))
- **pagination:** fix event bubbling on submit in pagination input ([2823526](https://github.com/entur/design-system/commits/2823526ef5e2899f664bc6e92b64a336d223f2c6))
- **pagination:** fix last page result count ([d49974d](https://github.com/entur/design-system/commits/d49974de499008235a89a1cfb1a6f4942e8230a5))
- **sidenavigation:** fix unwanted margin on svgs in sidenavigation ([1c2ccdd](https://github.com/entur/design-system/commits/1c2ccdde654e2865a56874c08edf1eedba8079ae))

### Features

- **pagination:** add numberOfResults prop ([e723b09](https://github.com/entur/design-system/commits/e723b0927ea5459a28bfba9fcc3ee40dedb7875d))

### BREAKING CHANGES

- **pagination:** numberOfResults is now required if you are using resultsPerPage functionality of Pagination

# [2.0.0](https://github.com/entur/design-system/compare/@entur/menu@1.6.2...@entur/menu@2.0.0) (2020-07-16)

### Bug Fixes

- add collapsible behaviour in navigationgroup ([02cfe8e](https://github.com/entur/design-system/commits/02cfe8ebd6f30b7dfe2303e37d7c33d003c72f07))
- optimize styling for collapsible side navigation ([f2a83f8](https://github.com/entur/design-system/commits/f2a83f8e500aa92c0b7b796a3e0669e8ac932d62))

### Features

- add collapsibleSideNavigation component ([4c59dc1](https://github.com/entur/design-system/commits/4c59dc187345a768c3f9037d1819e523fb9bd188))
- add icon prop for sidenavigationitem ([a82f0c3](https://github.com/entur/design-system/commits/a82f0c3333df8147ab454a513c8d8fd881982992))
- sidenavigation is white by default ([b7a880d](https://github.com/entur/design-system/commits/b7a880d8bd8ec126fe2f0ce8dfc9a5a90c483be2))

### BREAKING CHANGES

- is now non-contrast by default. wrap sidenavigation in Contrast to get "old" styling

## [1.6.2](https://github.com/entur/design-system/compare/@entur/menu@1.6.1...@entur/menu@1.6.2) (2020-07-13)

**Note:** Version bump only for package @entur/menu

## [1.6.1](https://github.com/entur/design-system/compare/@entur/menu@1.6.0...@entur/menu@1.6.1) (2020-07-09)

### Bug Fixes

- remove cursor pointer if stepper is non interactive ([b966b6c](https://github.com/entur/design-system/commits/b966b6c61286707ab29058a21b8dd0ebaead6bd5))

# [1.6.0](https://github.com/entur/design-system/compare/@entur/menu@1.5.5...@entur/menu@1.6.0) (2020-07-03)

### Bug Fixes

- fix link styling for breadcrumb ([94d2115](https://github.com/entur/design-system/commits/94d2115213867144388c26c86e6612e026b4532b))
- fix offset arrow in stepper ([db8d790](https://github.com/entur/design-system/commits/db8d7907de4618eb92f3c7f7502a5d4d64cdb16b))
- new styling and implementation of stepper component ([ff72140](https://github.com/entur/design-system/commits/ff72140dd8848a9bd1db353ad9137b8a9d3151d9))
- overflowmenu contrast styling similar to normal styling ([6d671ed](https://github.com/entur/design-system/commits/6d671ed9ee456c72475dfa266f037423b4a93c13))
- update dependency for overflowmenu ([fd9f1cb](https://github.com/entur/design-system/commits/fd9f1cb09a97bbde33a0088c55c26c252429a675))

### Features

- add forwardref for sidenavigationitem ([26d0a17](https://github.com/entur/design-system/commits/26d0a17aaccd9b11146ee2247bdedfa30b82de32))
- add interactive prop to stepper ([6f0b0f8](https://github.com/entur/design-system/commits/6f0b0f800a7104133c9d665181ec89cf37abbc2c))

## [1.5.5](https://github.com/entur/design-system/compare/@entur/menu@1.5.4...@entur/menu@1.5.5) (2020-06-17)

### Bug Fixes

- add aria label to pagination input ([545a25e](https://github.com/entur/design-system/commits/545a25e84e960ebc3365ac3e938f86d1a2f49b71))

## [1.5.4](https://github.com/entur/design-system/compare/@entur/menu@1.5.3...@entur/menu@1.5.4) (2020-05-27)

**Note:** Version bump only for package @entur/menu

## [1.5.3](https://github.com/entur/design-system/compare/@entur/menu@1.5.2...@entur/menu@1.5.3) (2020-05-26)

**Note:** Version bump only for package @entur/menu

## [1.5.2](https://github.com/entur/design-system/compare/@entur/menu@1.5.1...@entur/menu@1.5.2) (2020-05-20)

### Bug Fixes

- use the expand arrow component instead of icon ([44e955a](https://github.com/entur/design-system/commits/44e955a636f0c42b72e19029c75c6324f90c5ac3))

## [1.5.1](https://github.com/entur/design-system/compare/@entur/menu@1.5.0...@entur/menu@1.5.1) (2020-04-27)

**Note:** Version bump only for package @entur/menu

# [1.5.0](https://github.com/entur/design-system/compare/@entur/menu@1.4.0...@entur/menu@1.5.0) (2020-04-23)

### Bug Fixes

- updated to use new focus styling where applicable ([d0a52c0](https://github.com/entur/design-system/commits/d0a52c096b673c6647070a90dd79bef9003ee0ad))

### Features

- add results functionality for pagination component ([b6fe497](https://github.com/entur/design-system/commits/b6fe497ade85aec18307bf4a7cb5fa7281b0be46))

# [1.4.0](https://github.com/entur/design-system/compare/@entur/menu@1.3.5...@entur/menu@1.4.0) (2020-04-08)

### Features

- **overflow menu:** add overflowmenu components ([37cb99d](https://github.com/entur/design-system/commits/37cb99da557c5c806c6c10631743608a7f57fe5f))

## [1.3.5](https://github.com/entur/design-system/compare/@entur/menu@1.3.3...@entur/menu@1.3.5) (2020-03-25)

**Note:** Version bump only for package @entur/menu

## [1.3.4](https://github.com/entur/design-system/compare/@entur/menu@1.3.3...@entur/menu@1.3.4) (2020-03-25)

**Note:** Version bump only for package @entur/menu

## [1.3.3](https://github.com/entur/design-system/compare/@entur/menu@1.3.2...@entur/menu@1.3.3) (2020-03-20)

**Note:** Version bump only for package @entur/menu

## [1.3.2](https://github.com/entur/design-system/compare/@entur/menu@1.3.1...@entur/menu@1.3.2) (2020-03-18)

### Bug Fixes

- react elementtype on breadcrumb item "as" prop ([fbb869c](https://github.com/entur/design-system/commits/fbb869c4ffb9a53e246dc4c18270deb11a4d4999))

## [1.3.1](https://github.com/entur/design-system/compare/@entur/menu@1.3.0...@entur/menu@1.3.1) (2020-03-05)

### Bug Fixes

- fix padding for nested menu items ([8019a13](https://github.com/entur/design-system/commits/8019a13dad1728e491dbd637373d01acf8b1229b))

# [1.3.0](https://github.com/entur/design-system/compare/@entur/menu@1.2.11...@entur/menu@1.3.0) (2020-02-26)

### Features

- **stepper:** add stepper ([e07ffed](https://github.com/entur/design-system/commits/e07ffedafb3a83dbf34fae45f32ae3f3b62c655a))

## [1.2.11](https://github.com/entur/design-system/compare/@entur/menu@1.2.10...@entur/menu@1.2.11) (2020-02-20)

**Note:** Version bump only for package @entur/menu

## [1.2.10](https://github.com/entur/design-system/compare/@entur/menu@1.2.9...@entur/menu@1.2.10) (2020-02-14)

**Note:** Version bump only for package @entur/menu

## [1.2.9](https://github.com/entur/design-system/compare/@entur/menu@1.2.8...@entur/menu@1.2.9) (2020-02-12)

**Note:** Version bump only for package @entur/menu

## [1.2.8](https://github.com/entur/design-system/compare/@entur/menu@1.2.7...@entur/menu@1.2.8) (2020-02-10)

**Note:** Version bump only for package @entur/menu

## [1.2.7](https://github.com/entur/design-system/compare/@entur/menu@1.2.6...@entur/menu@1.2.7) (2020-02-05)

### Bug Fixes

- increasing padding left on side navigation items, and increasing max width ([6bf7ce6](https://github.com/entur/design-system/commits/6bf7ce6b277996fffd9085b72f23225bf1213496))
- remove 'inline' on icon on side navigation group ([525370f](https://github.com/entur/design-system/commits/525370f349d1acaf5b2b2b8b59ece9ff28d61c4c))
- remove test-files from build process ([e0b24af](https://github.com/entur/design-system/commits/e0b24af05d5c2ad8de4ae587d83c389495235890))

## [1.2.6](https://github.com/entur/design-system/compare/@entur/menu@1.2.5...@entur/menu@1.2.6) (2020-01-28)

**Note:** Version bump only for package @entur/menu

## [1.2.5](https://github.com/entur/design-system/compare/@entur/menu@1.2.4...@entur/menu@1.2.5) (2020-01-27)

### Bug Fixes

- **types:** place types in the correct place ([acace09](https://github.com/entur/design-system/commits/acace09ec0e258c5cff3a65e13ab29d6603780d9))

## [1.2.4](https://github.com/entur/design-system/compare/@entur/menu@1.2.3...@entur/menu@1.2.4) (2020-01-20)

### Bug Fixes

- **Pagination:** fix bug where low page counts didn't work ([5b564d8](https://github.com/entur/design-system/commits/5b564d882afe33dab27b737328de1510c1cd5b1f))
- **Pagination:** make ellipsisisisis less clickable ([f63f241](https://github.com/entur/design-system/commits/f63f24150f059214dfa776a2d1c18def8ff85b5a))
- **Pagination:** show number when ellipsis is a single number ([7bd8048](https://github.com/entur/design-system/commits/7bd80482d3cfb6be927851007b5e98c0b6ddc2b8))
- **Pagination:** show two neighbors instead of one ([e426962](https://github.com/entur/design-system/commits/e42696249bc2318d9a6babe95ee30700d845d42d))

## [1.2.3](https://github.com/entur/design-system/compare/@entur/menu@1.2.2...@entur/menu@1.2.3) (2020-01-14)

**Note:** Version bump only for package @entur/menu

## [1.2.2](https://github.com/entur/design-system/compare/@entur/menu@1.2.1...@entur/menu@1.2.2) (2020-01-13)

**Note:** Version bump only for package @entur/menu

## [1.2.1](https://github.com/entur/design-system/compare/@entur/menu@1.2.0...@entur/menu@1.2.1) (2020-01-08)

### Bug Fixes

- warn in development if the developer have forgotten the CSS ([e5c30fc](https://github.com/entur/design-system/commits/e5c30fc08624ef22c02773892778abd92205c6b0))

# [1.2.0](https://github.com/entur/design-system/compare/@entur/menu@1.1.0...@entur/menu@1.2.0) (2020-01-06)

### Bug Fixes

- **Pagination:** fix ios safari bug with small prev/next buttons ([c3c06d4](https://github.com/entur/design-system/commits/c3c06d408e994a14d94d1536da86111327e55fbb))
- **Pagination:** make each pagination page text unselectable ([746fc7a](https://github.com/entur/design-system/commits/746fc7ab6a2e6348a0a5e03f4c8c0000f9ed75b2))

### Features

- **BreadcrumbNavigation, BreadcrumbItem:** create new components for composing breadcrumbs together ([37c3e5e](https://github.com/entur/design-system/commits/37c3e5e897d222d65e0ce51fceae9693788a0f0f))
- **Breadcrumbs:** add new component - Breadcrumbs ([0ee248d](https://github.com/entur/design-system/commits/0ee248d7ac936904eaf9dbc324197d4bb44b498e))

# [1.1.0](https://github.com/entur/design-system/compare/@entur/menu@1.0.3...@entur/menu@1.1.0) (2019-12-20)

### Features

- **Pagination:** add new component - Pagination ([bc6d042](https://github.com/entur/design-system/commits/bc6d0427041a784a42ae028ebffc6271e5ab5a67))
- **Pagination:** add support for showInput ([588d9f3](https://github.com/entur/design-system/commits/588d9f31c769298e1b6d8d2aee3c97b5e308b4fe))

## [1.0.3](https://github.com/entur/design-system/compare/@entur/menu@1.0.2...@entur/menu@1.0.3) (2019-12-10)

### Bug Fixes

- **border left:** fixing skewed left border on active item ([fd69f56](https://github.com/entur/design-system/commits/fd69f565355ad8e61bdb70b001a5393d866dc599))
- **disabled sidemenu:** spreading props on component if SideNavigationItem is disabled ([0a4125a](https://github.com/entur/design-system/commits/0a4125a503a1cade6dfd8df5ae5beeed132d5b32))
- **disabled sidemenuitem:** proper props spread, and aria-disabled label ([15a578d](https://github.com/entur/design-system/commits/15a578d1872c14cccf4a8d19ee3e018d511caf8a))
- adding default prop as part of documentation ([1ef7510](https://github.com/entur/design-system/commits/1ef75107362f6262429d7fe31519b4353eccc8de))

## [1.0.2](https://github.com/entur/design-system/compare/@entur/menu@1.0.1...@entur/menu@1.0.2) (2019-11-29)

**Note:** Version bump only for package @entur/menu

## [1.0.1](https://github.com/entur/design-system/compare/@entur/menu@1.0.0...@entur/menu@1.0.1) (2019-11-28)

### Bug Fixes

- **SideNavigationGroup:** reduce vertical padding between elements ([3a4131a](https://github.com/entur/design-system/commits/3a4131a957634a46dcd29870cb301542fecdb6dc))

# [1.0.0](https://github.com/entur/design-system/compare/@entur/menu@0.5.0...@entur/menu@1.0.0) (2019-11-22)

### Bug Fixes

- **Menu:** fix issue where an empty menu was rendered ([360d3b0](https://github.com/entur/design-system/commits/360d3b03a2803981b9f9c44565a05c0a4467c7f1))

### Code Refactoring

- **Menu, MenuItem, MenuGroup:** rename to SideNavigation, -Item and -Group ([61fd869](https://github.com/entur/design-system/commits/61fd8698b9c32eaeae4e9521237609b09201dac9))
- **NavBarItem:** rename to TopNavigationItem ([56a219c](https://github.com/entur/design-system/commits/56a219c8f58137c34e72878fa1672ec99a1338ad))

### Features

- **MenuItem:** require MenuItems to be links ([caa5798](https://github.com/entur/design-system/commits/caa57987f134322f33249d109286e4ae109ff1cf))
- **types:** exporting all public types for public components ([4a277ab](https://github.com/entur/design-system/commits/4a277ab266fdb32a6760821a07b1c6cc716bac85))

### BREAKING CHANGES

- **NavBarItem:** NavBarItem is renamed to TopNavigationItem, but maintains the same API
- **Menu, MenuItem, MenuGroup:** Menu, MenuItem and MenuGroup is renamed, but maintains the same APIs
- **MenuItem:** MenuItem now needs to be a link to a landing page

# [0.5.0](https://github.com/entur/design-system/compare/@entur/menu@0.4.2...@entur/menu@0.5.0) (2019-11-18)

### Bug Fixes

- add explicit import of expand styling ([a90e9ed](https://github.com/entur/design-system/commits/a90e9ed06ddf3dae6a225c7a05923978844292b4))
- add missing type="button" to sub menu togglers ([2a47e90](https://github.com/entur/design-system/commits/2a47e90fd72d03db17a2b5d656546266fdc0574b))
- ignore as prop on MenuItems with sub menus ([56c5216](https://github.com/entur/design-system/commits/56c5216d21dffc00220f1bb9ed52d6ad9655341a))
- make sure the typography is correct for all menus ([b4fc9ce](https://github.com/entur/design-system/commits/b4fc9ce120cbf0dcf0ffef67356cf80891a5a7ca))
- verify that a child element is an entur menu the correct way ([a3e766f](https://github.com/entur/design-system/commits/a3e766fba398891bc664fac54bada81d1352d40b))

### Features

- adding new component -> NavBarItem ([70d3af0](https://github.com/entur/design-system/commits/70d3af0d02c1847596354242ddc293212b311e4a))

## [0.4.2](https://github.com/entur/design-system/compare/@entur/menu@0.4.1...@entur/menu@0.4.2) (2019-11-14)

### Bug Fixes

- **docs:** fix bug in sidebar for when the menu prop is a string ([ea2f2d9](https://github.com/entur/design-system/commits/ea2f2d987f8fee90b6af40c94953dc773f9eaccf))
- add missing dependencies to dependency arrays ([15f1e81](https://github.com/entur/design-system/commits/15f1e81f5a3dfea3e60453195379d392e6d536a0))
- **css classnames:** fixing naming collisions with CSS classes ([a93ca43](https://github.com/entur/design-system/commits/a93ca435d3a01d61d8f02694a672686b9e943a66))

## [0.4.1](https://github.com/entur/design-system/compare/@entur/menu@0.4.0...@entur/menu@0.4.1) (2019-11-07)

**Note:** Version bump only for package @entur/menu

# [0.4.0](https://github.com/entur/design-system/compare/@entur/menu@0.3.1...@entur/menu@0.4.0) (2019-11-06)

### Bug Fixes

- **MenuGroup:** add 1 px letter spacing to menu group label ([93b46fa](https://github.com/entur/design-system/commits/93b46fa034d96d5bda22a4a279ad2563c3d8e34b))
- **MenuGroup:** add margin between menu groups ([3bd10ff](https://github.com/entur/design-system/commits/3bd10ffcf84712f119f50165a753a43444ea209d))

### Features

- add new component MenuGroup ([1f5b6f1](https://github.com/entur/design-system/commits/1f5b6f1a2f40146a22e71cc6f71e3157f6a7ab9c))

## [0.3.1](https://github.com/entur/design-system/compare/@entur/menu@0.3.0...@entur/menu@0.3.1) (2019-11-04)

### Bug Fixes

- **Menu:** make sub menu detection work more consistently ([096538e](https://github.com/entur/design-system/commits/096538e83714261398379e56d31704a59c7324fc))

# [0.3.0](https://github.com/entur/design-system/compare/@entur/menu@0.2.3...@entur/menu@0.3.0) (2019-10-30)

### Bug Fixes

- migrate to latest version of space tokens ([4330496](https://github.com/entur/design-system/commits/4330496e269bf628f7b9b7aec75f704800201101))
- update all packages to use new tokens ([4847835](https://github.com/entur/design-system/commits/48478359b0e562ba828e06d9b5c57239316805c2))

### Features

- **MenuItem:** add new prop forceExpandSubMenus ([c6c307d](https://github.com/entur/design-system/commits/c6c307d045838c1d938da5bf162baa5cda300c5b))

## [0.2.3](https://github.com/entur/design-system/compare/@entur/menu@0.2.2...@entur/menu@0.2.3) (2019-10-22)

**Note:** Version bump only for package @entur/menu

## [0.2.2](https://github.com/entur/design-system/compare/@entur/menu@0.2.1...@entur/menu@0.2.2) (2019-10-11)

### Bug Fixes

- **menu:** set max-width for menus on desktop ([476b56e](https://github.com/entur/design-system/commits/476b56e))

## [0.2.1](https://github.com/entur/design-system/compare/@entur/menu@0.2.0...@entur/menu@0.2.1) (2019-10-07)

### Bug Fixes

- **menu:** lock React version to 16.9.x ([9d6fc2b](https://github.com/entur/design-system/commits/9d6fc2b))
- **menu:** make icons show up in the correct place and color ([6b54369](https://github.com/entur/design-system/commits/6b54369))

# 0.2.0 (2019-09-25)

### Bug Fixes

- add explicit dependency on classnames package ([8f491ac](https://github.com/entur/design-system/commits/8f491ac))
- make sure disabled links are actually disabled ([645ffed](https://github.com/entur/design-system/commits/645ffed))

### Features

- add a new package "menu" ([24365ff](https://github.com/entur/design-system/commits/24365ff))
