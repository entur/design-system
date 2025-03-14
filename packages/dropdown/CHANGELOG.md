# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.0.3](https://github.com/entur/design-system/compare/@entur/dropdown@7.0.2...@entur/dropdown@7.0.3) (2025-03-05)

### Bug Fixes

- **dropdown:** not focusable and interactive when disabled ([7aee4ae](https://github.com/entur/design-system/commit/7aee4ae1c54e98d4092c64243474f42319624af6))

## [7.0.2](https://github.com/entur/design-system/compare/@entur/dropdown@7.0.1...@entur/dropdown@7.0.2) (2025-02-25)

**Note:** Version bump only for package @entur/dropdown

## [7.0.1](https://github.com/entur/design-system/compare/@entur/dropdown@6.1.0...@entur/dropdown@7.0.1) (2025-02-20)

### Bug Fixes

- **baseformcontrol:** add correct text-color on readonly ([7fac4d7](https://github.com/entur/design-system/commit/7fac4d7f41d9618f1baaf021d4c13e1d075643ca))
- **dropdown:** add absolute position on dropdownlist ([30b7916](https://github.com/entur/design-system/commit/30b79163cb3bcd38fa66ee837b92abd011099446))

# [7.0.0](https://github.com/entur/design-system/compare/@entur/dropdown@6.1.0...@entur/dropdown@7.0.0) (2025-02-05)

### Refactor

- **dropdown:** remove deprecated dropdown components

### BREAKING CHANGES

- **dropdowns:** Deprecated dropdowns, i.e suffixed with Deprecated, e.g. DropdownDeprecated, are removed from @entur/dropdown. Use version 6.0.12 or earlier if
  you are still unable to migrate to the new versions. This change was in reality introduced in [6.0.13](https://github.com/entur/design-system/commit/54ce3886ddc0bab92bbae23bbda88044bf9ef452) by a mistake. We apologize for the inconvenience.

# [6.1.0](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.14...@entur/dropdown@6.1.0) (2025-01-24)

### Features

- **dropdown:** replace focus with focus-visible ([6112834](https://github.com/entur/design-system/commit/61128349be08d7fc60a605ad80579d8d582a4966))

## [6.0.14](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.13...@entur/dropdown@6.0.14) (2025-01-15)

**Note:** Version bump only for package @entur/dropdown

## [6.0.13](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.13-RC.0...@entur/dropdown@6.0.13) (2025-01-14)

### Bug Fixes

- **dropdown:** fix non-unique key in list ([2c6da92](https://github.com/entur/design-system/commit/2c6da929dd09d10f454a261765df32b30ae2c59e))

### BREAKING CHANGES

- **dropdowns:** Deprecated dropdowns, i.e suffixed with Deprecated, e.g. DropdownDeprecated, are removed from @entur/dropdown. Use version 6.0.12 or earlier if
  you are still unable to migrate to the new versions. This should have been a major release but was by a mistake release as a patch. We apologize for the inconvenience.

## [6.0.12](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.11...@entur/dropdown@6.0.12) (2024-12-06)

### Performance Improvements

- **dropdowns:** fix performance bug causing unnecessary rerenders ([f495f3a](https://github.com/entur/design-system/commit/f495f3ad869f4db3b68ad7b069bca414960a756d))

## [6.0.11](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.10...@entur/dropdown@6.0.11) (2024-11-29)

### Bug Fixes

- **dropdown:** add missing prop noMatchesText for when an empty list is provided to items ([65d025a](https://github.com/entur/design-system/commit/65d025ad038d8315a472eb6abb6d9cf2532f942a))

## [6.0.10](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.9...@entur/dropdown@6.0.10) (2024-11-20)

**Note:** Version bump only for package @entur/dropdown

## [6.0.9](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.8...@entur/dropdown@6.0.9) (2024-11-12)

### Bug Fixes

- **dropdowns:** fix elements in dropdown list not selectable with touch action ([dd7a4a8](https://github.com/entur/design-system/commit/dd7a4a8e4818c4c60e42ee68d36b507655d92aaa))
- **multiselect:** add missing prop disableLabelAnimation to MultiSelect ([01f9ef5](https://github.com/entur/design-system/commit/01f9ef5b08107f982edd669cf91a7373ee2739fc))

## [6.0.8](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.7...@entur/dropdown@6.0.8) (2024-10-23)

**Note:** Version bump only for package @entur/dropdown

## [6.0.7](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.6...@entur/dropdown@6.0.7) (2024-10-16)

**Note:** Version bump only for package @entur/dropdown

## [6.0.6](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.4...@entur/dropdown@6.0.6) (2024-10-03)

**Note:** Version bump only for package @entur/dropdown

## [6.0.5](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.4...@entur/dropdown@6.0.5) (2024-09-23)

**Note:** Version bump only for package @entur/dropdown

## [6.0.4](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.3...@entur/dropdown@6.0.4) (2024-09-19)

**Note:** Version bump only for package @entur/dropdown

## [6.0.3](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.2...@entur/dropdown@6.0.3) (2024-09-10)

### Bug Fixes

- **dropdown:** fix crash in special cases when selecting with tab ([ccc756d](https://github.com/entur/design-system/commits/ccc756d1e4d3e885459209793c470f798505b19a))
- **dropdown:** fix layout shift on loading ([6c36e1c](https://github.com/entur/design-system/commits/6c36e1cceb060b751f331f017c0d4634f8ef2572))
- **dropdown:** fix maximum update depth bug ([3ade9ef](https://github.com/entur/design-system/commits/3ade9ef6533c8f9b3af188124d51ca5a577e5561))
- **dropdown:** remove dead zones from dropdown ([9117b59](https://github.com/entur/design-system/commits/9117b5994ebf43e7b71532535c5a4007f397b7c6))
- **multiselect:** fix overflow issue in selectedItemTag ([3b27002](https://github.com/entur/design-system/commits/3b27002628232d0ec3b242c99efaab03a470296f))

### Performance Improvements

- **dropdown:** update dependency downshift to v9 ([421d283](https://github.com/entur/design-system/commits/421d283413692c56045891cf7775428f1b8c25d8))

## [6.0.2](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.1...@entur/dropdown@6.0.2) (2024-08-28)

**Note:** Version bump only for package @entur/dropdown

## [6.0.1](https://github.com/entur/design-system/compare/@entur/dropdown@6.0.0...@entur/dropdown@6.0.1) (2024-08-12)

**Note:** Version bump only for package @entur/dropdown

# [6.0.0](https://github.com/entur/design-system/compare/@entur/dropdown@5.5.1...@entur/dropdown@6.0.0) (2024-07-11)

### Bug Fixes

- **dropdowns:** make dropdowns work with improved base form control ([39e4ec1](https://github.com/entur/design-system/commits/39e4ec15cbae05ba8f799c0d333d0079346da2bb))

### BREAKING CHANGES

- **dropdowns:** Wrappers and some classes are removed.|If you are overriding internal styling classes make sure they
  look as expected after this update!

## [5.5.1](https://github.com/entur/design-system/compare/@entur/dropdown@5.5.0...@entur/dropdown@5.5.1) (2024-07-11)

**Note:** Version bump only for package @entur/dropdown

# [5.5.0](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.11...@entur/dropdown@5.5.0) (2024-06-24)

### Bug Fixes

- **dropdown:** fix searchable dropdown not setting selectedItem state correctly on initial render ([bd9fe65](https://github.com/entur/design-system/commits/bd9fe65a307f82e4e3ff8a016dd635b647da956a))
- **multiselect:** fix incorrect highlighted item in list after search ([6d25ec7](https://github.com/entur/design-system/commits/6d25ec76095e5d63f98d768fd0b6a007888c386a))

### Features

- **dropdown:** switch to floating-ui for dislaying dropdown list ([5a72a9f](https://github.com/entur/design-system/commits/5a72a9f7f8254df618659fd3136d4e13d683b07b))

### Performance Improvements

- **datepicker:** small fixes to datepicker ([b73467b](https://github.com/entur/design-system/commits/b73467be00a4dfce38bc0c775dff9a77e6fd5ff6))

## [5.4.11](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.10...@entur/dropdown@5.4.11) (2024-06-11)

### Bug Fixes

- **multiselect:** fix maxChips summarizing one chip before it should ([31e440c](https://github.com/entur/design-system/commits/31e440c19b96fc4c9ecb44c22b57839eac226b97))

## [5.4.10](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.9...@entur/dropdown@5.4.10) (2024-05-29)

### Bug Fixes

- **dropdown:** fixed a bug with clearInputOnSelect on multiselect ([4b79e6d](https://github.com/entur/design-system/commits/4b79e6d610051ca6bf37acad0ed183207275b8d0))

## [5.4.9](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.8...@entur/dropdown@5.4.9) (2024-05-21)

**Note:** Version bump only for package @entur/dropdown

## [5.4.8](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.7...@entur/dropdown@5.4.8) (2024-05-13)

**Note:** Version bump only for package @entur/dropdown

## [5.4.7](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.6...@entur/dropdown@5.4.7) (2024-05-07)

**Note:** Version bump only for package @entur/dropdown

## [5.4.6](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.5...@entur/dropdown@5.4.6) (2024-05-06)

### Bug Fixes

- **dropdown:** fix color on button-icon in contrastmode ([1870104](https://github.com/entur/design-system/commits/18701043e6e7226bae7b6d77afda307d3583c3ec))

## [5.4.5](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.4...@entur/dropdown@5.4.5) (2024-04-24)

**Note:** Version bump only for package @entur/dropdown

## [5.4.4](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.3...@entur/dropdown@5.4.4) (2024-04-22)

**Note:** Version bump only for package @entur/dropdown

## [5.4.3](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.2...@entur/dropdown@5.4.3) (2024-04-18)

**Note:** Version bump only for package @entur/dropdown

## [5.4.2](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.1...@entur/dropdown@5.4.2) (2024-04-18)

**Note:** Version bump only for package @entur/dropdown

## [5.4.1](https://github.com/entur/design-system/compare/@entur/dropdown@5.4.0...@entur/dropdown@5.4.1) (2024-04-12)

**Note:** Version bump only for package @entur/dropdown

# [5.4.0](https://github.com/entur/design-system/compare/@entur/dropdown@5.3.5...@entur/dropdown@5.4.0) (2024-04-11)

### Features

- **dropdown:** add new VariantType and deprecate the old ones ([492b9cf](https://github.com/entur/design-system/commits/492b9cf1644f1a0f7093ceddb74b04dbc491bd22))

## [5.3.5](https://github.com/entur/design-system/compare/@entur/dropdown@5.3.4...@entur/dropdown@5.3.5) (2024-04-10)

### Bug Fixes

- migrate away from legacy tilde imports in sass ([cc16e7f](https://github.com/entur/design-system/commits/cc16e7f1a8d65143ab0dd583aea76b5ba11be148))
- **tokens:** update color variable output functions ([602128b](https://github.com/entur/design-system/commits/602128b139ccc37ea6d7bfc695effeec0cc6ee71))

## [5.3.4](https://github.com/entur/design-system/compare/@entur/dropdown@5.3.3...@entur/dropdown@5.3.4) (2024-03-27)

### Bug Fixes

- **dropdowns:** support for labelTooltip prop is back ([3af9663](https://github.com/entur/design-system/commits/3af9663e7d95b41e481c647b19a4df51861f8585))

## [5.3.3](https://github.com/entur/design-system/compare/@entur/dropdown@5.3.2...@entur/dropdown@5.3.3) (2024-03-25)

**Note:** Version bump only for package @entur/dropdown

## [5.3.2](https://github.com/entur/design-system/compare/@entur/dropdown@5.3.1...@entur/dropdown@5.3.2) (2024-03-21)

**Note:** Version bump only for package @entur/dropdown

## [5.3.1](https://github.com/entur/design-system/compare/@entur/dropdown@5.3.0...@entur/dropdown@5.3.1) (2024-03-15)

**Note:** Version bump only for package @entur/dropdown

# [5.3.0](https://github.com/entur/design-system/compare/@entur/dropdown@5.2.0...@entur/dropdown@5.3.0) (2024-03-06)

### Bug Fixes

- **dropdown:** fix missing export for NormalizedDropdownItemType ([07d90da](https://github.com/entur/design-system/commits/07d90da702686c31f653866ee6411594d0ddbeea))
- **dropdown:** items can now be selected with spacebar in Dropdown as well ([c8a3525](https://github.com/entur/design-system/commits/c8a35257cf8a696ac0d6bff905372fbeae0c92a5))
- **dropdowns:** fix incorrect usage of aria-selected in dropdown list ([5eed47e](https://github.com/entur/design-system/commits/5eed47e4db822ae20642abc9db7909380e272662))

### Features

- **dropdowns:** update downshift to v8 ([7801946](https://github.com/entur/design-system/commits/7801946441df447cd8e6b0f91e273b27bf66696b))

# [5.2.0](https://github.com/entur/design-system/compare/@entur/dropdown@5.1.3...@entur/dropdown@5.2.0) (2024-02-22)

### Features

- **dropdown:** change list selection behaviour ([4007846](https://github.com/entur/design-system/commits/4007846ccde8d8a5d8e0874f0b7a92a03ecbc0f5))
- **dropdowns:** add type support for value in DropdownItem to be any non-nullish value ([6fb7a26](https://github.com/entur/design-system/commits/6fb7a262e6116db697b16fcbec57da84c665bb05))

## [5.1.3](https://github.com/entur/design-system/compare/@entur/dropdown@5.1.2...@entur/dropdown@5.1.3) (2024-02-12)

**Note:** Version bump only for package @entur/dropdown

## [5.1.2](https://github.com/entur/design-system/compare/@entur/dropdown@5.1.1...@entur/dropdown@5.1.2) (2024-02-01)

**Note:** Version bump only for package @entur/dropdown

## [5.1.1](https://github.com/entur/design-system/compare/@entur/dropdown@5.1.0...@entur/dropdown@5.1.1) (2024-01-26)

### Bug Fixes

- **dropdown:** fix list of items not updating on items prop update ([de72875](https://github.com/entur/design-system/commits/de728759ca3e2e977d2b46d8fea7424d07353a4a))

# [5.1.0](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.29...@entur/dropdown@5.1.0) (2024-01-24)

### Bug Fixes

- **dropdown:** fix height on dropdown ([89e1c40](https://github.com/entur/design-system/commits/89e1c401c972f76ef04fed79deaf9d1ebc100a13))

### Features

- **dropdown:** improve handling of async functions as items ([de36d9a](https://github.com/entur/design-system/commits/de36d9af407473ae190957bb7d6641f938232e95))

## [5.0.29](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.28...@entur/dropdown@5.0.29) (2024-01-08)

### Bug Fixes

- **iconbutton:** replaces border with outline ([ad8a877](https://github.com/entur/design-system/commits/ad8a877400388e5983263397791d81afec5b2212))

## [5.0.28](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.27...@entur/dropdown@5.0.28) (2023-12-22)

**Note:** Version bump only for package @entur/dropdown

## [5.0.27](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.26...@entur/dropdown@5.0.27) (2023-12-18)

**Note:** Version bump only for package @entur/dropdown

## [5.0.26](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.25...@entur/dropdown@5.0.26) (2023-12-11)

**Note:** Version bump only for package @entur/dropdown

## [5.0.24](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.23...@entur/dropdown@5.0.24) (2023-12-04)

### Bug Fixes

- **searchable dropdown:** fix searchable dropdown sometimes not opening on click ([376a87c](https://github.com/entur/design-system/commits/376a87c70380c248da848283c89f9bf24845ca35))

## [5.0.23](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.22...@entur/dropdown@5.0.23) (2023-11-16)

**Note:** Version bump only for package @entur/dropdown

## [5.0.22](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.21...@entur/dropdown@5.0.22) (2023-10-31)

### Bug Fixes

- **dropdown:** fix selectOnTab bug when tab-ing after selecting with enter ([164bfe9](https://github.com/entur/design-system/commits/164bfe988f1f7ff8ab8e15f4b21ef0be1da50d91))

## [5.0.21](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.20...@entur/dropdown@5.0.21) (2023-10-30)

### Bug Fixes

- **dropdown:** fix key issue with icons in dropdown list ([029d994](https://github.com/entur/design-system/commits/029d99478c17801b5b2c4b4b1c2031920b339dc5))

## [5.0.20](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.19...@entur/dropdown@5.0.20) (2023-10-23)

**Note:** Version bump only for package @entur/dropdown

## [5.0.19](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.18...@entur/dropdown@5.0.19) (2023-10-19)

### Bug Fixes

- **dropdowns:** fix visual and keyboard bugs when loading items ([5676095](https://github.com/entur/design-system/commits/56760957ea6b4f3e842d966bfd633d6073ca4716))

## [5.0.18](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.17...@entur/dropdown@5.0.18) (2023-10-13)

### Bug Fixes

- **dropdown:** fix selectOnTab clearing selection when tabing out ([27ac046](https://github.com/entur/design-system/commits/27ac046b59631ec3eb57ce0be5c7be5ee05352b2))

## [5.0.17](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.16...@entur/dropdown@5.0.17) (2023-10-11)

**Note:** Version bump only for package @entur/dropdown

## [5.0.16](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.15...@entur/dropdown@5.0.16) (2023-10-11)

**Note:** Version bump only for package @entur/dropdown

## [5.0.15](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.14...@entur/dropdown@5.0.15) (2023-10-09)

### Bug Fixes

- **dropdowns:** add missing text props for screen readers and visuals ([ac39e1a](https://github.com/entur/design-system/commits/ac39e1a4bd225ad9421ea50e4bb064291e15b9a8))

## [5.0.14](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.13...@entur/dropdown@5.0.14) (2023-10-06)

**Note:** Version bump only for package @entur/dropdown

## [5.0.13](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.12...@entur/dropdown@5.0.13) (2023-10-06)

**Note:** Version bump only for package @entur/dropdown

## [5.0.12](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.11...@entur/dropdown@5.0.12) (2023-09-29)

### Bug Fixes

- **dropdown:** fix layout shift issues in dropdown ([2ea227e](https://github.com/entur/design-system/commits/2ea227ef7ee1ccc6143db8e33c7c856bd03fbd6b))

## [5.0.11](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.7...@entur/dropdown@5.0.11) (2023-09-25)

### Bug Fixes

- **dropdown:** fix duplicate key error when using same icon twice in dropdowns ([cb82091](https://github.com/entur/design-system/commits/cb820910002ffa830a553dd0b2a13f26723497df))
- **dropdowns:** change selectOnBlur to selectOnTab to improve name precision ([e6a0ad1](https://github.com/entur/design-system/commits/e6a0ad142fb88a11290f2b51e81ac72594bd5483))
- **multiselect:** fix bug with stale data when fetching items from function ([467b7d7](https://github.com/entur/design-system/commits/467b7d73952d0b3b9fdad49c15efaa5c436ce640))
- **multiselect:** fix Select all duplicating selected items if items is a function ([6511017](https://github.com/entur/design-system/commits/6511017d8b26684493d42b5c2052c9fcc7dc0bb5))
- **searchable dropdown:** fix onChange not picking up selection bug ([ab6ff25](https://github.com/entur/design-system/commits/ab6ff2582482cf671a3f746c5991cb4f391f1544))
- **searchable dropdown:** fix visual bug with append ([739bf12](https://github.com/entur/design-system/commits/739bf12b2f299c2edd3c9f378213fe1f9607e837))

## [5.0.10](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.7...@entur/dropdown@5.0.10) (2023-09-25)

### Bug Fixes

- **dropdown:** fix duplicate key error when using same icon twice in dropdowns ([cb82091](https://github.com/entur/design-system/commits/cb820910002ffa830a553dd0b2a13f26723497df))
- **dropdowns:** change selectOnBlur to selectOnTab to improve name precision ([e6a0ad1](https://github.com/entur/design-system/commits/e6a0ad142fb88a11290f2b51e81ac72594bd5483))
- **multiselect:** fix bug with stale data when fetching items from function ([467b7d7](https://github.com/entur/design-system/commits/467b7d73952d0b3b9fdad49c15efaa5c436ce640))
- **multiselect:** fix Select all duplicating selected items if items is a function ([6511017](https://github.com/entur/design-system/commits/6511017d8b26684493d42b5c2052c9fcc7dc0bb5))
- **searchable dropdown:** fix onChange not picking up selection bug ([ab6ff25](https://github.com/entur/design-system/commits/ab6ff2582482cf671a3f746c5991cb4f391f1544))
- **searchable dropdown:** fix visual bug with append ([739bf12](https://github.com/entur/design-system/commits/739bf12b2f299c2edd3c9f378213fe1f9607e837))

## [5.0.9](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.9-beta.0...@entur/dropdown@5.0.9) (2023-09-12)

### Bug Fixes

- **dropdown:** fix duplicate key error when using same icon twice in dropdowns ([cb82091](https://github.com/entur/design-system/commits/cb820910002ffa830a553dd0b2a13f26723497df))
- **dropdowns:** change selectOnBlur to selectOnTab to improve name precision ([e6a0ad1](https://github.com/entur/design-system/commits/e6a0ad142fb88a11290f2b51e81ac72594bd5483))

## [5.0.9-beta.0](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.8...@entur/dropdown@5.0.9-beta.0) (2023-09-12)

### Bug Fixes

- **multiselect:** fix bug with stale data when fetching items from function ([467b7d7](https://github.com/entur/design-system/commits/467b7d73952d0b3b9fdad49c15efaa5c436ce640))
- **searchable dropdown:** fix visual bug with append ([739bf12](https://github.com/entur/design-system/commits/739bf12b2f299c2edd3c9f378213fe1f9607e837))

## [5.0.8](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.7...@entur/dropdown@5.0.8) (2023-09-08)

### Bug Fixes

- **multiselect:** fix Select all duplicating selected items if items is a function ([6511017](https://github.com/entur/design-system/commits/6511017d8b26684493d42b5c2052c9fcc7dc0bb5))

## [5.0.7](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.6...@entur/dropdown@5.0.7) (2023-09-08)

**Note:** Version bump only for package @entur/dropdown

## [5.0.6](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.5...@entur/dropdown@5.0.6) (2023-08-28)

### Bug Fixes

- **searchable dropdown:** fix dropdown changing width on selecting elements with width larger than f ([9d4b74e](https://github.com/entur/design-system/commits/9d4b74e34bd63593d773b506d5018e4f2d7acbb2))

## [5.0.5](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.4...@entur/dropdown@5.0.5) (2023-08-28)

**Note:** Version bump only for package @entur/dropdown

## [5.0.4](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.3...@entur/dropdown@5.0.4) (2023-08-24)

**Note:** Version bump only for package @entur/dropdown

## [5.0.3](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.2...@entur/dropdown@5.0.3) (2023-08-22)

### Bug Fixes

- **dropdown list:** update key handling ([b3cb928](https://github.com/entur/design-system/commits/b3cb9282ef4a00a657fc523adfb677a7425029eb))

## [5.0.2](https://github.com/entur/design-system/compare/@entur/dropdown@5.0.1...@entur/dropdown@5.0.2) (2023-08-16)

### Bug Fixes

- **dropdowns:** fix items function not refetching items on items prop change ([6424078](https://github.com/entur/design-system/commits/64240785b5307a95941177fbb28865cf19cd239e))

# [5.0.0](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.14...@entur/dropdown@5.0.0) (2023-08-10)

### Features

- **dropdown:** new dropdown component ([c17f408](https://github.com/entur/design-system/commits/c17f408697af3eaf4dbf08ae1e29c902ce8f68a9))
- **multiselect:** new multiselect component ([85d9c5a](https://github.com/entur/design-system/commits/85d9c5af5a046b35259be340a1cd7ea84350ca19))
- **searchable dropdown:** new searchable dropdown component ([aaa54a6](https://github.com/entur/design-system/commits/aaa54a6e04506374dd495b15a195cdab545079dd))
- **native dropdown:** update native dropdown to work better with NormalizedDropdownItemType ([097ee67](https://github.com/entur/design-system/commits/097ee67413152928d4c1abd04b8c15e1a122dee6))
- improve accessibility for dropdown components ([1a05e6b](https://github.com/entur/design-system/commits/1a05e6baa0ab9ce38c6bbab97d31b5db80a2f353))
- **multiselect tag:** add new compact tag design for selected elements ([3f8f640](https://github.com/entur/design-system/commits/3f8f640d1c0dc29b8a221cf06d7b025fe5727b13))
- **multiselect:** add possibility to reset input when selecting an item ([660b6b8](https://github.com/entur/design-system/commits/660b6b8e3e59cc201aee737e86de7a84b9dfb8f9))
- **dropdowns:** update to downshift v7 ([71c53e2](https://github.com/entur/design-system/commits/71c53e263f4bc80bb6e1d309e0366dd31821800d))

### BREAKING CHANGES

- **dropdown:** to avoid updating dropdown api, change name from:
  Dropdown -> DropdownDeprecated
  MultiSelect -> MultiSelectDeprecated
- **native dropdown:** onChange's arguments have changed to a object containing value, selectedItem and target
- **dropdown:** searchable prop is removed. SearchableDropdown is now a separate component. | - is now only
  available as a controlled component. 'value' is switched for 'selectedItem' and 'onChange' is
  required
- **searchable dropdown:** is now a separate component instead of a prop in dropdown. | - is now only available asa controlled
  component. 'value' is changed to 'selectedItem' and 'onChange' is required.
- **multiselect:** the component is now only available as controlled. 'value' has been replaced be 'selectedItems' and
  'onChange' is required

## [4.0.14](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.13...@entur/dropdown@4.0.14) (2023-08-09)

**Note:** Version bump only for package @entur/dropdown

## [4.0.13](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.12...@entur/dropdown@4.0.13) (2023-07-19)

**Note:** Version bump only for package @entur/dropdown

## [4.0.12](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.11...@entur/dropdown@4.0.12) (2023-07-19)

**Note:** Version bump only for package @entur/dropdown

## [4.0.11](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.10...@entur/dropdown@4.0.11) (2023-07-18)

**Note:** Version bump only for package @entur/dropdown

## [4.0.10](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.9...@entur/dropdown@4.0.10) (2023-05-11)

**Note:** Version bump only for package @entur/dropdown

# [5.0.0-beta.0](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.9...@entur/dropdown@5.0.0-beta.0) (2023-06-13)

### Features

- **dropdown:** new dropdown component ([a63a987](https://github.com/entur/design-system/commits/a63a987d1e91747f85eba56d6307f7b2de310304))
- **multiselect tag:** add new compact tag design for selected elements ([ecda2a7](https://github.com/entur/design-system/commits/ecda2a7cc1f6be89c5832c33ea3fec4b3da7bebd))
- **multiselect:** new multiselect component ([f92ba9e](https://github.com/entur/design-system/commits/f92ba9e4277883e23a3d3012d38f8372f2b8f678))
- **searchable dropdown:** new searchable dropdown component ([25f6af6](https://github.com/entur/design-system/commits/25f6af68ab312b5cccf537aa13e5c716a276e9e7))

### BREAKING CHANGES

- **dropdown:** searchable prop is removed. SearchableDropdown is now a separate component. | - is now only
  available as a controlled component. 'value' is switched for 'selectedItem' and 'onChange' is
  required
- **searchable dropdown:** is now a separate component instead of a prop in dropdown. | - is now only available asa controlled
  component. 'value' is changed to 'selectedItem' and 'onChange' is required.
- **multiselect:** the component is now only available as controlled. 'value' has been replaced be 'selectedItems' and
  'onChange' is required

## [4.0.9](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.8...@entur/dropdown@4.0.9) (2023-04-24)

**Note:** Version bump only for package @entur/dropdown

## [4.0.8](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.7...@entur/dropdown@4.0.8) (2023-04-21)

### Bug Fixes

- **dropdown:** add missing aria label to clearable button ([46240a9](https://github.com/entur/design-system/commits/46240a92e34ecab79a323ad3a8846cabe2b8c19a))

## [4.0.7](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.6...@entur/dropdown@4.0.7) (2023-04-17)

**Note:** Version bump only for package @entur/dropdown

## [4.0.6](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.3...@entur/dropdown@4.0.6) (2023-04-13)

### Bug Fixes

- **native dropdown:** hide visual arrow icon from screen readers and add missing connection between ([7a4454e](https://github.com/entur/design-system/commits/7a4454e655881d18a4dc5434f260ff831fa1700a))

## [4.0.5](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.3...@entur/dropdown@4.0.5) (2023-04-05)

**Note:** Version bump only for package @entur/dropdown

## [4.0.4](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.3...@entur/dropdown@4.0.4) (2023-04-04)

**Note:** Version bump only for package @entur/dropdown

## [4.0.3](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.2...@entur/dropdown@4.0.3) (2023-04-03)

**Note:** Version bump only for package @entur/dropdown

## [4.0.2](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.1...@entur/dropdown@4.0.2) (2023-04-03)

**Note:** Version bump only for package @entur/dropdown

## [4.0.1](https://github.com/entur/design-system/compare/@entur/dropdown@4.0.0...@entur/dropdown@4.0.1) (2023-03-31)

**Note:** Version bump only for package @entur/dropdown

# [4.0.0](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.37...@entur/dropdown@4.0.0) (2023-03-28)

### Bug Fixes

- **multiselect:** fix incorrect type for 'items' in Multiselect ([51fc20a](https://github.com/entur/design-system/commits/51fc20acb406de2693398642eabee3d392dcd166))

### BREAKING CHANGES

- **multiselect:** Previous type was incorrect, so technically not breaking, but type change may lead to TS-errrors

## [3.0.37](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.36...@entur/dropdown@3.0.37) (2023-03-27)

**Note:** Version bump only for package @entur/dropdown

## [3.0.36](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.35...@entur/dropdown@3.0.36) (2023-03-15)

**Note:** Version bump only for package @entur/dropdown

## [3.0.35](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.34...@entur/dropdown@3.0.35) (2023-03-13)

**Note:** Version bump only for package @entur/dropdown

## [3.0.34](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.33...@entur/dropdown@3.0.34) (2023-03-07)

**Note:** Version bump only for package @entur/dropdown

## [3.0.33](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.32...@entur/dropdown@3.0.33) (2023-03-03)

### Bug Fixes

- **dropdown:** fix hover highlight not working in dropdown list ([edb684a](https://github.com/entur/design-system/commits/edb684a98e7e99f3761812417a1c8f4dad87af0f))
- remove more non-break space that mess up stylesheets ([58148b0](https://github.com/entur/design-system/commits/58148b0c3fdaa25a64820263d26b5e49b7ddc96e))

## [3.0.32](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.31...@entur/dropdown@3.0.32) (2023-02-17)

**Note:** Version bump only for package @entur/dropdown

## [3.0.31](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.28...@entur/dropdown@3.0.31) (2023-02-17)

**Note:** Version bump only for package @entur/dropdown

## [3.0.30](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.28...@entur/dropdown@3.0.30) (2023-02-15)

**Note:** Version bump only for package @entur/dropdown

## [3.0.30](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.28...@entur/dropdown@3.0.30) (2023-02-15)

**Note:** Version bump only for package @entur/dropdown

## [3.0.29](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.28...@entur/dropdown@3.0.29) (2023-02-09)

**Note:** Version bump only for package @entur/dropdown

## [3.0.28](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.27...@entur/dropdown@3.0.28) (2023-02-02)

**Note:** Version bump only for package @entur/dropdown

## [3.0.26](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.25...@entur/dropdown@3.0.26) (2023-01-19)

**Note:** Version bump only for package @entur/dropdown

## [3.0.25](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.22...@entur/dropdown@3.0.25) (2022-12-09)

**Note:** Version bump only for package @entur/dropdown

## [3.0.24](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.23...@entur/dropdown@3.0.24) (2022-11-24)

**Note:** Version bump only for package @entur/dropdown

## [3.0.23](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.22...@entur/dropdown@3.0.23) (2022-10-31)

**Note:** Version bump only for package @entur/dropdown

## [3.0.22](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.21...@entur/dropdown@3.0.22) (2022-10-31)

**Note:** Version bump only for package @entur/dropdown

## [3.0.21](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.20...@entur/dropdown@3.0.21) (2022-10-31)

**Note:** Version bump only for package @entur/dropdown

## [3.0.20](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.19...@entur/dropdown@3.0.20) (2022-10-20)

**Note:** Version bump only for package @entur/dropdown

## [3.0.19](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.18...@entur/dropdown@3.0.19) (2022-10-20)

**Note:** Version bump only for package @entur/dropdown

## [3.0.18](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.17...@entur/dropdown@3.0.18) (2022-10-12)

**Note:** Version bump only for package @entur/dropdown

## [3.0.17](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.16...@entur/dropdown@3.0.17) (2022-10-05)

### Bug Fixes

- **dropdown:** make label required ([68cdd12](https://github.com/entur/design-system/commits/68cdd12ebb41998868acb18abb2a1faa47157449))

# [3.0.16](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.15...@entur/dropdown@4.0.0-beta.1) (2022-09-27)

### Features

- **searchable dropdown beta:** add new beta component for controlled searchable dropdown ([f6357e3](https://github.com/entur/design-system/commits/f6357e37826af7d25dbb4bdbe49a7fae1f632a50))

## [3.0.15](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.14...@entur/dropdown@3.0.15) (2022-09-20)

**Note:** Version bump only for package @entur/dropdown

## [3.0.14](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.13...@entur/dropdown@3.0.14) (2022-08-31)

**Note:** Version bump only for package @entur/dropdown

## [3.0.13](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.12...@entur/dropdown@3.0.13) (2022-08-24)

### Bug Fixes

- add parameter and return types ([861b878](https://github.com/entur/design-system/commits/861b8782b1fae34242d64371a8af7887ac545df6))

## [3.0.12](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.11...@entur/dropdown@3.0.12) (2022-08-12)

**Note:** Version bump only for package @entur/dropdown

## [3.0.11](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.10...@entur/dropdown@3.0.11) (2022-08-09)

**Note:** Version bump only for package @entur/dropdown

## [3.0.10](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.9...@entur/dropdown@3.0.10) (2022-08-09)

**Note:** Version bump only for package @entur/dropdown

## [3.0.9](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.8...@entur/dropdown@3.0.9) (2022-07-05)

**Note:** Version bump only for package @entur/dropdown

## [3.0.8](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.7...@entur/dropdown@3.0.8) (2022-06-28)

**Note:** Version bump only for package @entur/dropdown

## [3.0.7](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.6...@entur/dropdown@3.0.7) (2022-06-24)

**Note:** Version bump only for package @entur/dropdown

## [3.0.6](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.5...@entur/dropdown@3.0.6) (2022-06-02)

**Note:** Version bump only for package @entur/dropdown

## [3.0.5](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.4...@entur/dropdown@3.0.5) (2022-05-13)

**Note:** Version bump only for package @entur/dropdown

## [3.0.4](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.3...@entur/dropdown@3.0.4) (2022-05-04)

**Note:** Version bump only for package @entur/dropdown

## [3.0.3](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.2...@entur/dropdown@3.0.3) (2022-04-27)

**Note:** Version bump only for package @entur/dropdown

## [3.0.2](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.1...@entur/dropdown@3.0.2) (2022-04-20)

**Note:** Version bump only for package @entur/dropdown

## [3.0.1](https://github.com/entur/design-system/compare/@entur/dropdown@3.0.0...@entur/dropdown@3.0.1) (2022-04-19)

**Note:** Version bump only for package @entur/dropdown

# [3.0.0](https://github.com/entur/design-system/compare/@entur/dropdown@2.3.0...@entur/dropdown@3.0.0) (2022-03-17)

### Bug Fixes

- **dropdown:** fix text truncate shortening words which don't need shortening ([4072480](https://github.com/entur/design-system/commits/40724805af543369513d61c8d8d5b2461c48cc2f))

### Features

- **dropdown:** improve usability of input field in searchable dropdown ([9f24e4b](https://github.com/entur/design-system/commits/9f24e4b27b64b7f637914be6715a1ff4af7c0b77))

### BREAKING CHANGES

- **dropdown:** - Visuals and interaction method have changed

# [2.3.0](https://github.com/entur/design-system/compare/@entur/dropdown@2.2.4...@entur/dropdown@2.3.0) (2022-03-14)

### Features

- **dropdown:** add ref forwarding to dropdown and searchable dropdown ([af4cae7](https://github.com/entur/design-system/commits/af4cae7bb5fe83c5d1c2f58462c3ba6e77f2e1b8))

## [2.2.4](https://github.com/entur/design-system/compare/@entur/dropdown@2.2.3...@entur/dropdown@2.2.4) (2022-03-01)

**Note:** Version bump only for package @entur/dropdown

## [2.2.3](https://github.com/entur/design-system/compare/@entur/dropdown@2.2.2...@entur/dropdown@2.2.3) (2022-02-16)

### Bug Fixes

- **dropdown:** add missing styling for truncating searchable dropdown input ([c628982](https://github.com/entur/design-system/commits/c628982588035720aab68745c2fbe6f612ec4fde))

## [2.2.2](https://github.com/entur/design-system/compare/@entur/dropdown@2.2.1...@entur/dropdown@2.2.2) (2022-02-09)

### Bug Fixes

- **multiselect:** fix checkboxes bug in multiselect ([5b26980](https://github.com/entur/design-system/commits/5b26980596e461621956551ae916bca0e670f695))
- **multiselect:** fix checkboxes bug in multiselect ([9c59723](https://github.com/entur/design-system/commits/9c5972387d693cc83ac8361ee3ace643d9f60959))

## [2.2.1](https://github.com/entur/design-system/compare/@entur/dropdown@2.2.0...@entur/dropdown@2.2.1) (2022-01-21)

**Note:** Version bump only for package @entur/dropdown

# [2.2.0](https://github.com/entur/design-system/compare/@entur/dropdown@2.1.2...@entur/dropdown@2.2.0) (2022-01-05)

### Bug Fixes

- **searchable:** adjust position of selected item ([0abed8d](https://github.com/entur/design-system/commits/0abed8d3767dead4161d915a71ad94a8f64f600a))
- **searchable:** align selectedItem with input field ([527e4f4](https://github.com/entur/design-system/commits/527e4f4afea961a0f877e81a5b92f4ec0d44f97c))
- **searchable:** hide placeholder if item is selected ([933a6cb](https://github.com/entur/design-system/commits/933a6cb1b4f84346d737b23f36fc9c4252e7ea46))

### Features

- **searchable:** improve usability of searchable dropdown ([eb3038f](https://github.com/entur/design-system/commits/eb3038fb6fc6db7a55d3cc65541ab1d40a6e87af))

## [2.1.2](https://github.com/entur/design-system/compare/@entur/dropdown@2.1.1...@entur/dropdown@2.1.2) (2021-12-10)

**Note:** Version bump only for package @entur/dropdown

## [2.1.1](https://github.com/entur/design-system/compare/@entur/dropdown@2.1.0...@entur/dropdown@2.1.1) (2021-11-17)

### Bug Fixes

- change dropdown background to white in contrast mode ([7064988](https://github.com/entur/design-system/commits/7064988fd7690e500c08f74fee82d88566730ee1))

# [2.1.0](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.10...@entur/dropdown@2.1.0) (2021-10-25)

### Features

- **multiselect:** add support for initialSelectedItems ([40f14d7](https://github.com/entur/design-system/commits/40f14d7ccbba43d1da42834839246d294e289a7f))

## [2.0.10](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.9...@entur/dropdown@2.0.10) (2021-10-18)

**Note:** Version bump only for package @entur/dropdown

## [2.0.9](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.8...@entur/dropdown@2.0.9) (2021-09-23)

**Note:** Version bump only for package @entur/dropdown

## [2.0.8](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.7...@entur/dropdown@2.0.8) (2021-09-13)

### Bug Fixes

- **dropdown:** change to close small icon if closeable ([96d6e11](https://github.com/entur/design-system/commits/96d6e11bc27ed722f9bbb1623691de16612e432c))

## [2.0.7](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.6...@entur/dropdown@2.0.7) (2021-09-07)

### Bug Fixes

- improve typing and fix lint warnings ([6f0b0a8](https://github.com/entur/design-system/commits/6f0b0a8710e2353777547304ca101029a3f5d335))
- utilize reworked focus token ([586758f](https://github.com/entur/design-system/commits/586758fc86eb5aa52116c63c14ef033eb2e8b12f))
- **dropdown:** update dependencies ([1dc8971](https://github.com/entur/design-system/commits/1dc89716c46b8fc4c22d4426c2c583ad277f2e58))

## [2.0.6](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.5...@entur/dropdown@2.0.6) (2021-08-13)

### Bug Fixes

- **dropdown:** export dropdown props from package ([61326c6](https://github.com/entur/design-system/commits/61326c693a33569b5543778ac61b09c31a77ebd3))

## [2.0.5](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.4...@entur/dropdown@2.0.5) (2021-07-16)

### Bug Fixes

- **dropdown:** fix divider color in contrast ([6c9ac18](https://github.com/entur/design-system/commits/6c9ac180c08387dfdcd75a463bb3bd9199fcbedc))

## [2.0.4](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.3...@entur/dropdown@2.0.4) (2021-07-07)

### Bug Fixes

- **dropdown:** fix clearable prop and warnings ([1f9a5ae](https://github.com/entur/design-system/commits/1f9a5ae3ec0dd86188353c015926931ce645cb33))

## [2.0.3](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.2...@entur/dropdown@2.0.3) (2021-06-25)

### Bug Fixes

- **dropdown:** improve internal prop usage, better support for testing ([b4982a9](https://github.com/entur/design-system/commits/b4982a933807382bc956fac4224e32306ef3ad61))
- update dependencies ([0834b3a](https://github.com/entur/design-system/commits/0834b3a1f4268460958d003926330e69af34c132))

## [2.0.2](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.1...@entur/dropdown@2.0.2) (2021-06-04)

### Bug Fixes

- **native dropdown:** fix label position bug ([b68fc8f](https://github.com/entur/design-system/commits/b68fc8fffd94be986b3988cd2ff32b9c1a8268dd))

## [2.0.1](https://github.com/entur/design-system/compare/@entur/dropdown@2.0.0...@entur/dropdown@2.0.1) (2021-05-19)

### Bug Fixes

- **multiselect:** fix onchange late callback bug ([5998355](https://github.com/entur/design-system/commits/59983553e6ae68f80cfde356b48f748f837c7751))

# [2.0.0](https://github.com/entur/design-system/compare/@entur/dropdown@1.4.7...@entur/dropdown@2.0.0) (2021-05-05)

### Bug Fixes

- **multiselect:** finalize styling for new multiselect ([7b59c68](https://github.com/entur/design-system/commits/7b59c68946dc9f0ae1dab5e19979d79def85a5c9))

### Features

- **multiselect:** update multiselect component ([665a14c](https://github.com/entur/design-system/commits/665a14cd7f1a8f4482cb902eea592f81e86b2798))

### BREAKING CHANGES

- **multiselect:** full rewrite so may be some breaking changes

## [1.4.7](https://github.com/entur/design-system/compare/@entur/dropdown@1.4.6...@entur/dropdown@1.4.7) (2021-04-23)

### Bug Fixes

- utilize loading dots for dropdown components ([ffecc56](https://github.com/entur/design-system/commits/ffecc56854b2a69e50e0f265fa0b71b6118f4565))
- utilize new focus tokens ([17113ef](https://github.com/entur/design-system/commits/17113ef3f791c86fa6e19e71680fd5acdbae4990))

## [1.4.6](https://github.com/entur/design-system/compare/@entur/dropdown@1.4.5...@entur/dropdown@1.4.6) (2021-04-09)

**Note:** Version bump only for package @entur/dropdown

## [1.4.5](https://github.com/entur/design-system/compare/@entur/dropdown@1.4.4...@entur/dropdown@1.4.5) (2021-03-02)

### Bug Fixes

- **dropdown:** center label if empty placeholder is used ([eee6815](https://github.com/entur/design-system/commits/eee6815fdb2404aad3844f93c6bbd645a8d3772a))

## [1.4.4](https://github.com/entur/design-system/compare/@entur/dropdown@1.4.3...@entur/dropdown@1.4.4) (2021-02-17)

**Note:** Version bump only for package @entur/dropdown

## [1.4.3](https://github.com/entur/design-system/compare/@entur/dropdown@1.4.2...@entur/dropdown@1.4.3) (2021-02-05)

### Bug Fixes

- **dropdown:** add checkicon if item is selected ([2853763](https://github.com/entur/design-system/commits/28537634e783b44ed6457f3c6a23637ef76c9526))
- **dropdown:** adjust styling for dropdownlist in contrast ([e3aef6c](https://github.com/entur/design-system/commits/e3aef6cd77c82050aeec495a4fb71ba2bc90a5ef))

## [1.4.2](https://github.com/entur/design-system/compare/@entur/dropdown@1.4.1...@entur/dropdown@1.4.2) (2021-01-29)

**Note:** Version bump only for package @entur/dropdown

## [1.4.1](https://github.com/entur/design-system/compare/@entur/dropdown@1.4.0...@entur/dropdown@1.4.1) (2021-01-20)

### Bug Fixes

- **dropdown:** internal changes to avoid ref bug during tests ([df9eb46](https://github.com/entur/design-system/commits/df9eb4608e88020bf80b55b87ace952e697ac307))

# [1.4.0](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.24...@entur/dropdown@1.4.0) (2021-01-13)

### Bug Fixes

- transpose grey colors for updated color tokens ([d6a444c](https://github.com/entur/design-system/commits/d6a444c2c37339b9bac0702738ed52693367d344))
- update downshift dependency ([90fdadc](https://github.com/entur/design-system/commits/90fdadc7b673526fcc3b0def78d7803d0fe723c1))
- **multiselect:** fix improper colors on chips in contrast ([d226c39](https://github.com/entur/design-system/commits/d226c3981092ab1e9dcf16d52a66a88a1de6f55f))

### Features

- **dropdown:** add disable label animation prop ([fd0d040](https://github.com/entur/design-system/commits/fd0d040079f22fb83a7656d295b9c2270f30b6aa))

## [1.3.24](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.23...@entur/dropdown@1.3.24) (2021-01-05)

### Bug Fixes

- **dropdown:** improve internal id to enhance a11y ([ca7b730](https://github.com/entur/design-system/commits/ca7b730a8685356735b1eb4fd5052247016be313))

## [1.3.23](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.22...@entur/dropdown@1.3.23) (2020-12-04)

**Note:** Version bump only for package @entur/dropdown

## [1.3.22](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.21...@entur/dropdown@1.3.22) (2020-11-26)

### Bug Fixes

- **dropdown:** type=button on expand arrow ([614a1e8](https://github.com/entur/design-system/commits/614a1e8b9327b91f81655f1f185ab81effa0d046))
- **dropdowns:** make all dropdowns light in contrast mode ([fa293a9](https://github.com/entur/design-system/commits/fa293a9840613aebdad0a5a88613774b9e65ec33))
- **multiselect:** type=button on expand arrow ([59e1261](https://github.com/entur/design-system/commits/59e12612469ee1f1e1a0c0a4248ce0a61c1294bd))

## [1.3.21](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.20...@entur/dropdown@1.3.21) (2020-11-10)

**Note:** Version bump only for package @entur/dropdown

## [1.3.20](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.19...@entur/dropdown@1.3.20) (2020-11-05)

**Note:** Version bump only for package @entur/dropdown

## [1.3.19](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.18...@entur/dropdown@1.3.19) (2020-10-28)

**Note:** Version bump only for package @entur/dropdown

## [1.3.18](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.17...@entur/dropdown@1.3.18) (2020-10-23)

**Note:** Version bump only for package @entur/dropdown

## [1.3.17](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.16...@entur/dropdown@1.3.17) (2020-10-16)

**Note:** Version bump only for package @entur/dropdown

## [1.3.16](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.15...@entur/dropdown@1.3.16) (2020-10-09)

**Note:** Version bump only for package @entur/dropdown

## [1.3.15](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.14...@entur/dropdown@1.3.15) (2020-10-09)

### Bug Fixes

- **dropdown:** fix openonfocus bug ([dc53cc9](https://github.com/entur/design-system/commits/dc53cc9cc4be4bee5252ef908e193198acab751a))
- **dropdown:** update dropdown to new input styling ([fde0958](https://github.com/entur/design-system/commits/fde095895ef2d6f0954bcafb94bea9deacd33d7d))
- **nativedropdown:** update internal logic for new inputfield design ([ba742c6](https://github.com/entur/design-system/commits/ba742c6f151dfd451ef951ebaf3260f9e9ed8dc2))

## [1.3.14](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.13...@entur/dropdown@1.3.14) (2020-09-25)

**Note:** Version bump only for package @entur/dropdown

## [1.3.13](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.12...@entur/dropdown@1.3.13) (2020-09-14)

**Note:** Version bump only for package @entur/dropdown

## [1.3.12](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.11...@entur/dropdown@1.3.12) (2020-09-10)

### Bug Fixes

- **dropdown:** adjust placeholder color ([2a555d8](https://github.com/entur/design-system/commits/2a555d8494979cf47608bb5d93a9a552031770b9))

## [1.3.11](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.10...@entur/dropdown@1.3.11) (2020-09-02)

**Note:** Version bump only for package @entur/dropdown

## [1.3.10](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.9...@entur/dropdown@1.3.10) (2020-08-26)

**Note:** Version bump only for package @entur/dropdown

## [1.3.9](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.8...@entur/dropdown@1.3.9) (2020-08-20)

**Note:** Version bump only for package @entur/dropdown

## [1.3.8](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.7...@entur/dropdown@1.3.8) (2020-08-19)

**Note:** Version bump only for package @entur/dropdown

## [1.3.7](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.6...@entur/dropdown@1.3.7) (2020-08-14)

**Note:** Version bump only for package @entur/dropdown

## [1.3.6](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.5...@entur/dropdown@1.3.6) (2020-08-11)

**Note:** Version bump only for package @entur/dropdown

## [1.3.5](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.4...@entur/dropdown@1.3.5) (2020-07-24)

### Bug Fixes

- **multiselect:** improve internal filtering for selected item ([ad706e4](https://github.com/entur/design-system/commits/ad706e4afdb8a137aed30873735a95d8acb8d713))

## [1.3.4](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.3...@entur/dropdown@1.3.4) (2020-07-22)

### Bug Fixes

- **dropdown:** center dropdown toggle icon ([9865382](https://github.com/entur/design-system/commits/9865382689bbcd3b4f79b8d8ac651097607b346e))
- **multiselect:** rework internal logic, and wrapping of multiple items ([fccfc96](https://github.com/entur/design-system/commits/fccfc96f86dfc007f0d69527eac2186b27cceeae))

## [1.3.3](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.2...@entur/dropdown@1.3.3) (2020-07-16)

**Note:** Version bump only for package @entur/dropdown

## [1.3.2](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.1...@entur/dropdown@1.3.2) (2020-07-13)

**Note:** Version bump only for package @entur/dropdown

## [1.3.1](https://github.com/entur/design-system/compare/@entur/dropdown@1.3.0...@entur/dropdown@1.3.1) (2020-07-09)

**Note:** Version bump only for package @entur/dropdown

# [1.3.0](https://github.com/entur/design-system/compare/@entur/dropdown@1.2.0...@entur/dropdown@1.3.0) (2020-07-03)

### Bug Fixes

- fix classname and styling for outer div of dropdown ([799b8c6](https://github.com/entur/design-system/commits/799b8c6de07ddf8186ab7828f7db0490832b6b49))

### Features

- add itemfilter prop ([02daaf8](https://github.com/entur/design-system/commits/02daaf8d2863936d47c2165fb39bf799f624286a))

# [1.2.0](https://github.com/entur/design-system/compare/@entur/dropdown@1.1.2...@entur/dropdown@1.2.0) (2020-06-17)

### Bug Fixes

- fix contrast styling for nativedropdown ([b8d0ffd](https://github.com/entur/design-system/commits/b8d0ffd99b5382a807515b5d291a767d9338171b))

### Features

- highlight items that matches keypress key ([d8f5c26](https://github.com/entur/design-system/commits/d8f5c261c236cf089eced9d5b5aebe3397a64262))

## [1.1.2](https://github.com/entur/design-system/compare/@entur/dropdown@1.1.1...@entur/dropdown@1.1.2) (2020-05-27)

**Note:** Version bump only for package @entur/dropdown

## [1.1.1](https://github.com/entur/design-system/compare/@entur/dropdown@1.1.0...@entur/dropdown@1.1.1) (2020-05-26)

### Bug Fixes

- completely remove inner right padding in dropdowns ([3f3d086](https://github.com/entur/design-system/commits/3f3d0860f6f9a0f385182045dfeea7a5eb6ede3e))

# [1.1.0](https://github.com/entur/design-system/compare/@entur/dropdown@1.0.0...@entur/dropdown@1.1.0) (2020-05-20)

### Bug Fixes

- fix crash on special characters in searchable dropdown ([2149d9a](https://github.com/entur/design-system/commits/2149d9a4efddfa8dde1e73e6cfb43a878b3cc136))
- reduce internal dropdown padding ([fa081c9](https://github.com/entur/design-system/commits/fa081c96220f1c8cab6ee5db2fb39575869d6afa))

### Features

- add the multiselect dropdown component ([7863395](https://github.com/entur/design-system/commits/786339586a90a7f75c17115837b824a9d4981bcf))

# [1.0.0](https://github.com/entur/design-system/compare/@entur/dropdown@0.9.2...@entur/dropdown@1.0.0) (2020-04-27)

### Bug Fixes

- fix for controllable dropdown component ([408c627](https://github.com/entur/design-system/commits/408c627fd8b78881f404d733ec78367192eec2b1))

### BREAKING CHANGES

- new internal handling of null and undefined, meaning if you used null or undefined earlier, this may
  break your setup. null is now "no item" and undefined is reserved for uncontrolled behaviour

## [0.9.2](https://github.com/entur/design-system/compare/@entur/dropdown@0.9.1...@entur/dropdown@0.9.2) (2020-04-23)

### Bug Fixes

- fix potential key uniqueness bug ([bebf25e](https://github.com/entur/design-system/commits/bebf25e19a342c558d192f02a3929f03cfbff242))
- updated to use new focus styling where applicable ([d0a52c0](https://github.com/entur/design-system/commits/d0a52c096b673c6647070a90dd79bef9003ee0ad))

## [0.9.1](https://github.com/entur/design-system/compare/@entur/dropdown@0.9.0...@entur/dropdown@0.9.1) (2020-04-08)

**Note:** Version bump only for package @entur/dropdown

# [0.9.0](https://github.com/entur/design-system/compare/@entur/dropdown@0.7.4...@entur/dropdown@0.9.0) (2020-03-25)

### Features

- **dropdown:** add tooltip support to dropdowns ([fbe81d3](https://github.com/entur/design-system/commits/fbe81d3d8daf65cba1d815afe1d5efa2d14be291))

# [0.8.0](https://github.com/entur/design-system/compare/@entur/dropdown@0.7.4...@entur/dropdown@0.8.0) (2020-03-25)

### Features

- **dropdown:** add tooltip support to dropdowns ([fbe81d3](https://github.com/entur/design-system/commits/fbe81d3d8daf65cba1d815afe1d5efa2d14be291))

## [0.7.4](https://github.com/entur/design-system/compare/@entur/dropdown@0.7.3...@entur/dropdown@0.7.4) (2020-03-20)

**Note:** Version bump only for package @entur/dropdown

## [0.7.3](https://github.com/entur/design-system/compare/@entur/dropdown@0.7.2...@entur/dropdown@0.7.3) (2020-03-18)

### Bug Fixes

- update to use new shadow tokens ([37dfe1c](https://github.com/entur/design-system/commits/37dfe1c887cbb0357609bbc482ee8a306ba91d20))

## [0.7.2](https://github.com/entur/design-system/compare/@entur/dropdown@0.7.1...@entur/dropdown@0.7.2) (2020-03-05)

**Note:** Version bump only for package @entur/dropdown

## [0.7.1](https://github.com/entur/design-system/compare/@entur/dropdown@0.7.0...@entur/dropdown@0.7.1) (2020-02-26)

**Note:** Version bump only for package @entur/dropdown

# [0.7.0](https://github.com/entur/design-system/compare/@entur/dropdown@0.6.0...@entur/dropdown@0.7.0) (2020-02-20)

### Features

- add clearable prop for dropdown ([7c048be](https://github.com/entur/design-system/commits/7c048be592be8f77ccfe4bfcbc285d18510df41b))

# [0.6.0](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.9...@entur/dropdown@0.6.0) (2020-02-14)

### Bug Fixes

- decrease padding inside dropdown ([63b847f](https://github.com/entur/design-system/commits/63b847f74fbbf9d0cb8806b8d1018548ca1d23bd))
- Remove prop which is not used ([5c4758e](https://github.com/entur/design-system/commits/5c4758ef37eeabf86ae6f79a3c5ff53a46003d0a))
- **dropdown:** Only auto-highlight if the option has been set ([6127c1b](https://github.com/entur/design-system/commits/6127c1be48bb16650ec354a592ab85ce59e5e951))

### Features

- **dropdown:** ability to style dropdown list directly ([9449090](https://github.com/entur/design-system/commits/94490901e196b78d95d9136d3aaa41b8a993b517))
- **dropdown:** Add option for auto highlighting the first result ([2833e24](https://github.com/entur/design-system/commits/2833e24256eb7f0cf9198eae9fda2d720e8b9fc9))

## [0.5.9](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.8...@entur/dropdown@0.5.9) (2020-02-12)

### Bug Fixes

- fix missing type for spreading of props ([0e5beba](https://github.com/entur/design-system/commits/0e5beba82ea7dde39915cd626e665aa6c15dafbf))

## [0.5.8](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.7...@entur/dropdown@0.5.8) (2020-02-10)

### Bug Fixes

- remove arrow from dropdown if readonly ([eca07da](https://github.com/entur/design-system/commits/eca07da574ab130b0f3313202d34f72f221b5265))

## [0.5.7](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.6...@entur/dropdown@0.5.7) (2020-02-05)

### Bug Fixes

- remove test-files from build process ([e0b24af](https://github.com/entur/design-system/commits/e0b24af05d5c2ad8de4ae587d83c389495235890))

## [0.5.6](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.5...@entur/dropdown@0.5.6) (2020-01-31)

**Note:** Version bump only for package @entur/dropdown

## [0.5.5](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.4...@entur/dropdown@0.5.5) (2020-01-28)

**Note:** Version bump only for package @entur/dropdown

## [0.5.4](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.3...@entur/dropdown@0.5.4) (2020-01-27)

### Bug Fixes

- **Dropdown:** make dropdowns controllable ([38e503e](https://github.com/entur/design-system/commits/38e503edf6cee98ec7e086a6f836c8bf899adb75))
- **Dropdown:** make long choices overflow into an ellipsis ([c936358](https://github.com/entur/design-system/commits/c9363585f316936b8eac2d100b90d28f1f30f760))
- **Dropdown:** make styles spreadable to the input group ([8ef9a24](https://github.com/entur/design-system/commits/8ef9a244de17cad1c4fd63c13127527f02be103c))
- **Dropdown:** remove unnecessary classNames call ([97cf52c](https://github.com/entur/design-system/commits/97cf52c42f419f042a3fc93ab493417c2baae7af))
- **DropdownList:** only show scrollbar if necessary ([09b25e9](https://github.com/entur/design-system/commits/09b25e9558fe6aff6de9a695c37b67a2da98cdad))
- **types:** place types in the correct place ([acace09](https://github.com/entur/design-system/commits/acace09ec0e258c5cff3a65e13ab29d6603780d9))

## [0.5.3](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.2...@entur/dropdown@0.5.3) (2020-01-20)

**Note:** Version bump only for package @entur/dropdown

## [0.5.2](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.1...@entur/dropdown@0.5.2) (2020-01-14)

**Note:** Version bump only for package @entur/dropdown

## [0.5.1](https://github.com/entur/design-system/compare/@entur/dropdown@0.5.0...@entur/dropdown@0.5.1) (2020-01-13)

**Note:** Version bump only for package @entur/dropdown

# [0.5.0](https://github.com/entur/design-system/compare/@entur/dropdown@0.4.2...@entur/dropdown@0.5.0) (2020-01-10)

### Features

- add classname prop for dropdown component ([60bdd48](https://github.com/entur/design-system/commits/60bdd487a1cd04d0e55363698b095041e4953216))

## [0.4.2](https://github.com/entur/design-system/compare/@entur/dropdown@0.4.1...@entur/dropdown@0.4.2) (2020-01-08)

### Bug Fixes

- warn in development if the developer have forgotten the CSS ([e5c30fc](https://github.com/entur/design-system/commits/e5c30fc08624ef22c02773892778abd92205c6b0))

## [0.4.1](https://github.com/entur/design-system/compare/@entur/dropdown@0.4.0...@entur/dropdown@0.4.1) (2020-01-06)

### Bug Fixes

- **Dropdown:** add a max-height to DropdownList, and improve a11y ([d3f5046](https://github.com/entur/design-system/commits/d3f50460a8fa78bbc95b3274bb5678a1a51b9f73))
- **Dropdown:** add missing dependencies ([e7c046f](https://github.com/entur/design-system/commits/e7c046f5408170a3974790f3ccfa2d77e7510f49))
- **Dropdown:** fetch initially also for searchable dropdowns ([8e18927](https://github.com/entur/design-system/commits/8e189274fc6dfe743f17ed819e7aaefad20b2bf9))

# [0.4.0](https://github.com/entur/design-system/compare/@entur/dropdown@0.3.0...@entur/dropdown@0.4.0) (2019-12-20)

### Features

- **Dropdown:** add openOnFocus prop for Dropdown ([313f61f](https://github.com/entur/design-system/commits/313f61f6829ad66eb9896dae65fd11db5f4ea073))

# [0.3.0](https://github.com/entur/design-system/compare/@entur/dropdown@0.2.1...@entur/dropdown@0.3.0) (2019-12-17)

### Bug Fixes

- **Dropdown:** fix bug where focus order was disturbed for dropdowns ([652f2fa](https://github.com/entur/design-system/commits/652f2fa3771a77d6a9786c0ab299c1c29852d598))

### Features

- **Dropdown:** add debounce functionality for dropdowns ([6d2fec3](https://github.com/entur/design-system/commits/6d2fec33f0a85c022201873bd55173665918a194))
- **Dropdown:** add typeahead support to Dropdowns ([3c283e0](https://github.com/entur/design-system/commits/3c283e01f752752ffe3cc9c7bfbbbc838dd97992))

## [0.2.1](https://github.com/entur/design-system/compare/@entur/dropdown@0.2.0...@entur/dropdown@0.2.1) (2019-12-10)

**Note:** Version bump only for package @entur/dropdown

# 0.2.0 (2019-12-10)

### Bug Fixes

- **Dropdown:** fix bug where Dropdown wasn't controllable ([1748946](https://github.com/entur/design-system/commits/1748946a6be483d75d887e6548deb52f509a2823))

### Features

- **Dropdown:** implement new Dropdown component ([966bc50](https://github.com/entur/design-system/commits/966bc5074e32a7dfc0e8fc8e2bba8413e4b19eb5))
