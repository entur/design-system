# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@2.0.1...@entur/datepicker@2.0.2) (2022-04-27)

**Note:** Version bump only for package @entur/datepicker

## [2.0.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@2.0.0...@entur/datepicker@2.0.1) (2022-04-20)

**Note:** Version bump only for package @entur/datepicker

# [2.0.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@1.0.0...@entur/datepicker@2.0.0) (2022-04-19)

### Bug Fixes

- **datepicker:** fix validation in datepicker breaking if other locale than nb is used ([aa13c15](https://bitbucket.org/enturas/design-system/commits/aa13c15ff76afe8946aec40c87992e564626dcdb))

### BREAKING CHANGES

- **datepicker:** locale prop is changed to only accept a date-fns Locale object, previously a string was also
  accepted

# [1.0.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.11.6...@entur/datepicker@1.0.0) (2022-04-13)

### Features

- **datepicker:** add custom header to datepicker ([6c9c863](https://bitbucket.org/enturas/design-system/commits/6c9c8636a4eec59b86db928aceb9e4e01c1fa07e))
- **datepicker:** rewrite custom input in datepicker to use TextField component ([3cc2e51](https://bitbucket.org/enturas/design-system/commits/3cc2e51948080f21b0ec343c06e886b8d285ffbc))
- **datepicker:** rewrite styling for datepicker calendar popover ([3f10c85](https://bitbucket.org/enturas/design-system/commits/3f10c85aceb02f46d93035ee6b7a9f9e8b26d024))
- **datepicker:** rewrite validation logic for datepicker ([db25f30](https://bitbucket.org/enturas/design-system/commits/db25f30f009c32018d3707ac53cca2c6f30e9f0a))

### BREAKING CHANGES

- **datepicker:** - selectedDate is now a required prop

* Complete rewrite of component may have introduced unnoticed bugs

- **datepicker:** - Calendar button design has changed

* Complete rewrite of component may have introduced unnoticed bugs

- **datepicker:** Complete rewrite of component may have introduced unnoticed bugs
- **datepicker:** Complete rewrite of component may have introduced unnoticed bugs

## [0.11.6](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.11.5...@entur/datepicker@0.11.6) (2022-03-24)

### Bug Fixes

- **datepicker:** manual input should respect validation with regards to minDate and maxDate ([cb2eecd](https://bitbucket.org/enturas/design-system/commits/cb2eecd71a962494a0414ce68a544d03bbccfbca))

## [0.11.5](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.11.4...@entur/datepicker@0.11.5) (2022-03-17)

### Bug Fixes

- **datepicker:** fix visuals not updating when changing selectedDate prop ([c6882ad](https://bitbucket.org/enturas/design-system/commits/c6882ad4629282797faf16f597e26c18284440af))

## [0.11.4](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.11.3...@entur/datepicker@0.11.4) (2022-03-14)

**Note:** Version bump only for package @entur/datepicker

## [0.11.3](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.11.2...@entur/datepicker@0.11.3) (2022-03-08)

### Bug Fixes

- **datepicker:** change feedback and variant prop to work as in 0.10.8 ([af84259](https://bitbucket.org/enturas/design-system/commits/af842597395c4279bc502b04de9e84cc3a2db3ab))

### Reverts

- Revert "chore(release): publish" ([cb0b756](https://bitbucket.org/enturas/design-system/commits/cb0b75692eeb5614317b333dc0b0437e68a6b6cf))

## [0.11.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.11.1...@entur/datepicker@0.11.2) (2022-03-01)

**Note:** Version bump only for package @entur/datepicker

## [0.11.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.11.0...@entur/datepicker@0.11.1) (2022-02-14)

### Bug Fixes

- **datepicker:** fix default value for date not working ([283734a](https://bitbucket.org/enturas/design-system/commits/283734af696c1ed5ddb13232c8a7c3a4916551b0))

# [0.11.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.8...@entur/datepicker@0.11.0) (2022-02-09)

### Features

- **date picker:** add visual date validation to date picker and hideCalendar prop ([aae7cbf](https://bitbucket.org/enturas/design-system/commits/aae7cbfe4e02c1e5ebc676c1e083f74c54bafbbb))

### BREAKING CHANGES

- **date picker:** - Validation icon introduces visual changes. Use hideFeedback to remove.

* dateFormat prop removed

## [0.10.8](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.7...@entur/datepicker@0.10.8) (2022-01-21)

**Note:** Version bump only for package @entur/datepicker

## [0.10.7](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.6...@entur/datepicker@0.10.7) (2022-01-05)

**Note:** Version bump only for package @entur/datepicker

## [0.10.6](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.5...@entur/datepicker@0.10.6) (2021-12-10)

**Note:** Version bump only for package @entur/datepicker

## [0.10.5](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.4...@entur/datepicker@0.10.5) (2021-11-17)

### Bug Fixes

- **nativedatepicker:** fix label position bug ([dfa18f4](https://bitbucket.org/enturas/design-system/commits/dfa18f4cbac6e19a2e093f04d447c25b6956bf6d))
- **timepicker:** adjust styling of arrow buttons ([4f23bbc](https://bitbucket.org/enturas/design-system/commits/4f23bbc0b7907e59bad8679a98ea0be622423658))

## [0.10.4](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.3...@entur/datepicker@0.10.4) (2021-10-25)

**Note:** Version bump only for package @entur/datepicker

## [0.10.3](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.2...@entur/datepicker@0.10.3) (2021-10-18)

### Bug Fixes

- **datepicker:** adjust month button color ([f043577](https://bitbucket.org/enturas/design-system/commits/f043577e981ba00fc6df48529b5687e8c6a20085))
- **datepicker:** improve id prop usage ([4a5bca9](https://bitbucket.org/enturas/design-system/commits/4a5bca9064f2623a038a86a414ca5494fc246f59))
- **timepicker:** add hover-styling for arrow buttons ([960bdff](https://bitbucket.org/enturas/design-system/commits/960bdffc1af52af92d549b4b514209f04f7c8c36))

## [0.10.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.1...@entur/datepicker@0.10.2) (2021-09-23)

**Note:** Version bump only for package @entur/datepicker

## [0.10.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.10.0...@entur/datepicker@0.10.1) (2021-09-13)

### Bug Fixes

- **datepicker:** fix feedback prop not rendering text ([620ccfd](https://bitbucket.org/enturas/design-system/commits/620ccfd578d7acaa2e47738fe56f42a26de094e0))

# [0.10.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.9.3...@entur/datepicker@0.10.0) (2021-09-07)

### Bug Fixes

- utilize reworked focus token ([586758f](https://bitbucket.org/enturas/design-system/commits/586758fc86eb5aa52116c63c14ef033eb2e8b12f))
- **datepicker:** fix classname prop ([6e85e91](https://bitbucket.org/enturas/design-system/commits/6e85e916b25bab0264871b22182a9a5c4079dce9))
- **datepicker:** update dependencies ([58ce892](https://bitbucket.org/enturas/design-system/commits/58ce89230a339178c557680138bb5801e65780e8))
- **timepicker:** remove prepend prop ([fb8ad76](https://bitbucket.org/enturas/design-system/commits/fb8ad7667cedf97b1f7bdf0d7bb59c4e1ab10b84))

### Features

- **datepicker:** add hideCalendarButton prop ([5228910](https://bitbucket.org/enturas/design-system/commits/5228910eff6ce09632ecd466bda326014f576fe9))

### BREAKING CHANGES

- **timepicker:** prepend prop is no longer supported for timepicker

## [0.9.3](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.9.2...@entur/datepicker@0.9.3) (2021-08-13)

### Bug Fixes

- **datepicker:** fix issues with locale and weeklabel prop ([8a0ec92](https://bitbucket.org/enturas/design-system/commits/8a0ec92b7026a828b99d40dcdf6463555429b467))
- **datepicker:** update datepicker dependency ([e58c5a5](https://bitbucket.org/enturas/design-system/commits/e58c5a51066d97fdd193708bd50dc1a344fc5265))

## [0.9.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.9.1...@entur/datepicker@0.9.2) (2021-07-16)

### Bug Fixes

- **datepicker:** open calendar button is now type="button" ([a778341](https://bitbucket.org/enturas/design-system/commits/a7783419045912e361506092a5e493c521789406))

## [0.9.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.9.0...@entur/datepicker@0.9.1) (2021-07-16)

### Bug Fixes

- **datepicker:** adjust styling of dates in calendar ([1a68332](https://bitbucket.org/enturas/design-system/commits/1a68332ae769a2bc991f8a4d0e93cd5d903a5303))
- **datepicker:** change calendar icon import name change ([d9ed6a1](https://bitbucket.org/enturas/design-system/commits/d9ed6a1339537a631cc4126e0f909eb2daa7e0f1))

# [0.9.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.8.6...@entur/datepicker@0.9.0) (2021-07-07)

### Bug Fixes

- **datepicker:** add support for data cy ([b22129e](https://bitbucket.org/enturas/design-system/commits/b22129e402853e448890238cc2e60a61f834010f))
- **datepicker:** improve internal structure and style ([30b411b](https://bitbucket.org/enturas/design-system/commits/30b411bdd969f47d8d4e3f08093cbfb7b1a3d9e5))
- **datepicker:** update dependency for types ([b65a58e](https://bitbucket.org/enturas/design-system/commits/b65a58ecdf317888b19facc6b88a9592b99641cc))

### Features

- **datepicker:** datepicker with calendar button and styling overhaul ([c049398](https://bitbucket.org/enturas/design-system/commits/c049398cb6d96acbae3fcb0f12fd61f71a3c60a9))

## [0.8.6](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.8.5...@entur/datepicker@0.8.6) (2021-06-25)

### Bug Fixes

- update dependencies ([30ebcbd](https://bitbucket.org/enturas/design-system/commits/30ebcbdbcf6acdf31130c8b30bce2dc7163592d0))

## [0.8.5](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.8.4...@entur/datepicker@0.8.5) (2021-06-04)

### Bug Fixes

- **datepicker:** fix disabled prop ([13952f7](https://bitbucket.org/enturas/design-system/commits/13952f7ea1c7acdc922057ffd6011890fd78d4bb))
- **datepicker:** reduce internal padding ([1b0d79c](https://bitbucket.org/enturas/design-system/commits/1b0d79cc1dd4ce5ca10c77af4e0635900bda4f54))
- **timepicker:** fix disabled prop ([ea40de6](https://bitbucket.org/enturas/design-system/commits/ea40de6eaaa829ede67070e9504da376d0c41123))
- **timepicker:** reduce internal padding ([0e19c8d](https://bitbucket.org/enturas/design-system/commits/0e19c8d58d8f88b7d7b1a7763b5c4c59fbb4d319))

## [0.8.4](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.8.3...@entur/datepicker@0.8.4) (2021-05-26)

### Bug Fixes

- **datepicker:** improve defaults for dateformat prop ([da95ded](https://bitbucket.org/enturas/design-system/commits/da95ded77314aa1e929b550afaabc6dea4d3f37a))

## [0.8.3](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.8.2...@entur/datepicker@0.8.3) (2021-05-19)

**Note:** Version bump only for package @entur/datepicker

## [0.8.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.8.1...@entur/datepicker@0.8.2) (2021-05-05)

**Note:** Version bump only for package @entur/datepicker

## [0.8.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.8.0...@entur/datepicker@0.8.1) (2021-04-23)

### Bug Fixes

- **timepicker:** add type=button on timepicker arrow buttons ([aaa98a3](https://bitbucket.org/enturas/design-system/commits/aaa98a351c2aed5ff6cb45f0e808b53f0ad1ba4f))
- **timepicker:** fix onblur not being called on blur ([bea36e1](https://bitbucket.org/enturas/design-system/commits/bea36e1fc358a823e73d8d3cf3e6149449df842a))
- utilize new focus tokens ([17113ef](https://bitbucket.org/enturas/design-system/commits/17113ef3f791c86fa6e19e71680fd5acdbae4990))

# [0.8.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.7.2...@entur/datepicker@0.8.0) (2021-04-09)

### Bug Fixes

- update datepicker dependency ([2f57daf](https://bitbucket.org/enturas/design-system/commits/2f57daf567c9f665e5958b04311851c4aed4d74b))

### Features

- **timepicker:** remove dropdown and add time skip buttons ([59d7e55](https://bitbucket.org/enturas/design-system/commits/59d7e55a50a6b3d8157a6cb432876c6810bdcf31))

## [0.7.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.7.1...@entur/datepicker@0.7.2) (2021-03-02)

**Note:** Version bump only for package @entur/datepicker

## [0.7.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.7.0...@entur/datepicker@0.7.1) (2021-02-17)

### Bug Fixes

- **date and timepicker:** fix usage of id and aria labelledby ([cc54924](https://bitbucket.org/enturas/design-system/commits/cc549240ff4f4580b58832a2c4cd6ce6dcc7db9b))
- update styles from dependency to latest version ([eba5023](https://bitbucket.org/enturas/design-system/commits/eba5023a64c1bede02b30209ee3faa44c0f49058))
- **datepicker:** lock dependency at newest version ([7461b71](https://bitbucket.org/enturas/design-system/commits/7461b7174bd265a7fdd9a44bcad98c2c413b62ed))
- **datepicker:** update dependency for datepicker & timepicker ([51b3733](https://bitbucket.org/enturas/design-system/commits/51b3733dc7f474807634a8d76cdd14f6dec6c959))
- **timepicker:** adjust height on timepicker list items ([a6ab9d0](https://bitbucket.org/enturas/design-system/commits/a6ab9d0893afee5ccefbbb9f1942945611bd136f))

# [0.7.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.6.0...@entur/datepicker@0.7.0) (2021-02-05)

### Bug Fixes

- **timepicker:** adjust styling for timepicker list ([8327f50](https://bitbucket.org/enturas/design-system/commits/8327f5088a00e2ee8a0478db18656a4c5153ab8c))

### Features

- **datepicker:** add support for prepend prop ([6027030](https://bitbucket.org/enturas/design-system/commits/602703077e22bfe7b56d85388e4dbf55e7ad90fd))
- **timepicker:** add support for prepend prop ([aab70fa](https://bitbucket.org/enturas/design-system/commits/aab70fa55e21de10bae4cff664ad4c526cab2cbb))

# [0.6.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.5.1...@entur/datepicker@0.6.0) (2021-01-29)

### Bug Fixes

- **datepicker:** changed to correct z-index for date / time pickers ([9cdf145](https://bitbucket.org/enturas/design-system/commits/9cdf14549734a5592fc12782a191151b571721d0))
- **datepicker:** fix label position bug for async values ([8902190](https://bitbucket.org/enturas/design-system/commits/8902190ead5725f0ca206262384fdc0b9007f43c))
- **datepicker:** fix linting error ([f49ed6c](https://bitbucket.org/enturas/design-system/commits/f49ed6c1e3cf7cb571e992093a0de9f6d8192d96))
- **nativedatepicker:** fix label position for async values ([bc1cfff](https://bitbucket.org/enturas/design-system/commits/bc1cfff98c11082bad99b438bc720b7f8085340b))
- **nativetimepicker:** fix label position for async values ([88f3201](https://bitbucket.org/enturas/design-system/commits/88f320139d09e4cce231f53cc56aa65542a774e2))
- **timepicker:** fix label position bug for async values ([8d34a3c](https://bitbucket.org/enturas/design-system/commits/8d34a3c6c387edd2f52f68f00e05c5c75754cfb8))
- **timepicker:** fix linting error ([e984c47](https://bitbucket.org/enturas/design-system/commits/e984c4767da358c52395722466b9814ccd162b65))

### Features

- **datepicker:** add support to overwrite locale prop ([0874b2a](https://bitbucket.org/enturas/design-system/commits/0874b2a5d18f7d55e94f21d5717e07b41281e1e8))
- **timepicker:** add support to overwrite default locale ([b7a4f46](https://bitbucket.org/enturas/design-system/commits/b7a4f4606544f72f9c45f01e2fcd364d64db70ee))

## [0.5.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.5.0...@entur/datepicker@0.5.1) (2021-01-20)

**Note:** Version bump only for package @entur/datepicker

# [0.5.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.9...@entur/datepicker@0.5.0) (2021-01-13)

### Bug Fixes

- **nativetimepicker:** fix onchange bug ([c657561](https://bitbucket.org/enturas/design-system/commits/c65756127b3f7b4d5e515b6718d95f80fe5071eb))
- transpose grey colors for updated color tokens ([d6a444c](https://bitbucket.org/enturas/design-system/commits/d6a444c2c37339b9bac0702738ed52693367d344))

### Features

- **datepicker:** add disable label animation prop ([118496c](https://bitbucket.org/enturas/design-system/commits/118496c6b291778d8e23c17e38a0f822708ef052))
- **timepicker:** add disable label animation prop ([df55cae](https://bitbucket.org/enturas/design-system/commits/df55cae3fdd31d51909916171138a9502b43081e))

## [0.4.9](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.8...@entur/datepicker@0.4.9) (2021-01-05)

### Bug Fixes

- **timepicker:** improve internal labelId usage ([3a799a3](https://bitbucket.org/enturas/design-system/commits/3a799a3b30d09ac563df3c121801888bc2eb03fe))

## [0.4.8](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.7...@entur/datepicker@0.4.8) (2020-12-04)

### Bug Fixes

- **datepicker:** improve typings ([f591482](https://bitbucket.org/enturas/design-system/commits/f591482f637515b3326769e0ab63a274a369de40))
- **nativedatepicker:** improve typings ([540a727](https://bitbucket.org/enturas/design-system/commits/540a72746bf2904549ad9d0c5f9f3ddc0834823c))
- **nativetimepicker:** improve typings ([65ce080](https://bitbucket.org/enturas/design-system/commits/65ce0804e934ae06196de9281b2d32a741350bbc))
- **timepicker:** improve typings ([75515c7](https://bitbucket.org/enturas/design-system/commits/75515c750683e094a543bc158ee02048a08216ad))

## [0.4.7](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.6...@entur/datepicker@0.4.7) (2020-11-26)

### Bug Fixes

- **date/timepicker:** make lighter in contrast mode ([02d2ee8](https://bitbucket.org/enturas/design-system/commits/02d2ee8074a4b7cd25839c00bf48afcb99de86da))

## [0.4.6](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.5...@entur/datepicker@0.4.6) (2020-11-10)

**Note:** Version bump only for package @entur/datepicker

## [0.4.5](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.4...@entur/datepicker@0.4.5) (2020-11-05)

**Note:** Version bump only for package @entur/datepicker

## [0.4.4](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.3...@entur/datepicker@0.4.4) (2020-10-28)

**Note:** Version bump only for package @entur/datepicker

## [0.4.3](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.2...@entur/datepicker@0.4.3) (2020-10-23)

**Note:** Version bump only for package @entur/datepicker

## [0.4.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.1...@entur/datepicker@0.4.2) (2020-10-16)

**Note:** Version bump only for package @entur/datepicker

## [0.4.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.4.0...@entur/datepicker@0.4.1) (2020-10-09)

**Note:** Version bump only for package @entur/datepicker

# [0.4.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.36...@entur/datepicker@0.4.0) (2020-10-09)

### Bug Fixes

- **datepicker:** improve a11y ([9035970](https://bitbucket.org/enturas/design-system/commits/903597084f8b110d07c3550a5e3782422c27abd7))

### Features

- **datepicker:** add inputgroup props to component ([81f0fec](https://bitbucket.org/enturas/design-system/commits/81f0fec76b089e13a5d781a7af82ea3201ef9a62))
- **nativedatepicker:** add input group props to nativedatepicker ([6f09ad3](https://bitbucket.org/enturas/design-system/commits/6f09ad3fc09d976d0807bf2abc91f0763f02b654))
- **nativetimepicker:** add input group props to native time picker ([20d773f](https://bitbucket.org/enturas/design-system/commits/20d773f63d5e2163f2091e1174490cbb2830386a))
- **timepicker:** add inputgroup props to timepicker ([41004ca](https://bitbucket.org/enturas/design-system/commits/41004ca9d7ba8df2928486a73f699c6f475ad0bf))

### BREAKING CHANGES

- **nativedatepicker:** label is required
- **nativetimepicker:** label is required
- **timepicker:** label is required
- **datepicker:** label prop is required

## [0.3.36](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.35...@entur/datepicker@0.3.36) (2020-09-25)

**Note:** Version bump only for package @entur/datepicker

## [0.3.35](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.34...@entur/datepicker@0.3.35) (2020-09-14)

**Note:** Version bump only for package @entur/datepicker

## [0.3.34](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.33...@entur/datepicker@0.3.34) (2020-09-10)

**Note:** Version bump only for package @entur/datepicker

## [0.3.33](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.32...@entur/datepicker@0.3.33) (2020-09-02)

**Note:** Version bump only for package @entur/datepicker

## [0.3.32](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.31...@entur/datepicker@0.3.32) (2020-08-26)

### Bug Fixes

- **datepicker:** forward referencing for datepicker ([511aa8c](https://bitbucket.org/enturas/design-system/commits/511aa8cf834347e1a18a0d5c576509c998b2c729))
- **timepicker:** forward referencing for timepicker ([6626315](https://bitbucket.org/enturas/design-system/commits/66263155db7b8b03914d60f02d52824cdbbc0e61))

## [0.3.31](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.30...@entur/datepicker@0.3.31) (2020-08-20)

**Note:** Version bump only for package @entur/datepicker

## [0.3.30](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.29...@entur/datepicker@0.3.30) (2020-08-19)

**Note:** Version bump only for package @entur/datepicker

## [0.3.29](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.28...@entur/datepicker@0.3.29) (2020-08-14)

**Note:** Version bump only for package @entur/datepicker

## [0.3.28](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.27...@entur/datepicker@0.3.28) (2020-08-11)

**Note:** Version bump only for package @entur/datepicker

## [0.3.27](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.26...@entur/datepicker@0.3.27) (2020-07-24)

**Note:** Version bump only for package @entur/datepicker

## [0.3.26](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.25...@entur/datepicker@0.3.26) (2020-07-22)

**Note:** Version bump only for package @entur/datepicker

## [0.3.25](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.24...@entur/datepicker@0.3.25) (2020-07-16)

**Note:** Version bump only for package @entur/datepicker

## [0.3.24](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.23...@entur/datepicker@0.3.24) (2020-07-13)

**Note:** Version bump only for package @entur/datepicker

## [0.3.23](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.22...@entur/datepicker@0.3.23) (2020-07-09)

### Bug Fixes

- lock datepicker dependancy to avoid focus lock ([8ae96e9](https://bitbucket.org/enturas/design-system/commits/8ae96e9d58c7a2441447c93a607f4f9e33d04f06))

## [0.3.22](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.21...@entur/datepicker@0.3.22) (2020-07-03)

**Note:** Version bump only for package @entur/datepicker

## [0.3.21](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.20...@entur/datepicker@0.3.21) (2020-06-17)

### Bug Fixes

- fix readonly styling for datepicker ([f0ed1e5](https://bitbucket.org/enturas/design-system/commits/f0ed1e50a3e0c576e717df3faf4604e74f694d62))
- fix wrong definition of forward referencing ([e5cad92](https://bitbucket.org/enturas/design-system/commits/e5cad92c59bc6453ab4dbe9a18c4c7e42dd7e00d))

## [0.3.20](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.19...@entur/datepicker@0.3.20) (2020-05-27)

**Note:** Version bump only for package @entur/datepicker

## [0.3.19](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.18...@entur/datepicker@0.3.19) (2020-05-26)

**Note:** Version bump only for package @entur/datepicker

## [0.3.18](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.17...@entur/datepicker@0.3.18) (2020-05-20)

**Note:** Version bump only for package @entur/datepicker

## [0.3.17](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.16...@entur/datepicker@0.3.17) (2020-04-27)

**Note:** Version bump only for package @entur/datepicker

## [0.3.16](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.15...@entur/datepicker@0.3.16) (2020-04-23)

**Note:** Version bump only for package @entur/datepicker

## [0.3.15](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.14...@entur/datepicker@0.3.15) (2020-04-08)

**Note:** Version bump only for package @entur/datepicker

## [0.3.14](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.12...@entur/datepicker@0.3.14) (2020-03-25)

**Note:** Version bump only for package @entur/datepicker

## [0.3.13](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.12...@entur/datepicker@0.3.13) (2020-03-25)

**Note:** Version bump only for package @entur/datepicker

## [0.3.12](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.11...@entur/datepicker@0.3.12) (2020-03-20)

**Note:** Version bump only for package @entur/datepicker

## [0.3.11](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.10...@entur/datepicker@0.3.11) (2020-03-18)

### Bug Fixes

- update to use new shadow tokens ([37dfe1c](https://bitbucket.org/enturas/design-system/commits/37dfe1c887cbb0357609bbc482ee8a306ba91d20))

## [0.3.10](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.9...@entur/datepicker@0.3.10) (2020-03-05)

**Note:** Version bump only for package @entur/datepicker

## [0.3.9](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.8...@entur/datepicker@0.3.9) (2020-02-26)

**Note:** Version bump only for package @entur/datepicker

## [0.3.8](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.7...@entur/datepicker@0.3.8) (2020-02-20)

### Bug Fixes

- include react datepicker css directly ([29e8402](https://bitbucket.org/enturas/design-system/commits/29e84028b43c2d4664bcf7b71eaac4dea78e59c9))

## [0.3.7](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.6...@entur/datepicker@0.3.7) (2020-02-14)

**Note:** Version bump only for package @entur/datepicker

## [0.3.6](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.5...@entur/datepicker@0.3.6) (2020-02-12)

**Note:** Version bump only for package @entur/datepicker

## [0.3.5](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.4...@entur/datepicker@0.3.5) (2020-02-10)

**Note:** Version bump only for package @entur/datepicker

## [0.3.4](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.3...@entur/datepicker@0.3.4) (2020-02-05)

### Bug Fixes

- remove test-files from build process ([e0b24af](https://bitbucket.org/enturas/design-system/commits/e0b24af05d5c2ad8de4ae587d83c389495235890))

## [0.3.3](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.2...@entur/datepicker@0.3.3) (2020-01-31)

### Bug Fixes

- fix overflow design bug of timepicker ([258a748](https://bitbucket.org/enturas/design-system/commits/258a7486b3ee4ee28af96a3b73356423b6c57cd3))

## [0.3.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.1...@entur/datepicker@0.3.2) (2020-01-28)

**Note:** Version bump only for package @entur/datepicker

## [0.3.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.3.0...@entur/datepicker@0.3.1) (2020-01-27)

### Bug Fixes

- **types:** place types in the correct place ([acace09](https://bitbucket.org/enturas/design-system/commits/acace09ec0e258c5cff3a65e13ab29d6603780d9))

# [0.3.0](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.2.5...@entur/datepicker@0.3.0) (2020-01-20)

### Bug Fixes

- fixing styling of datepicker ([7a12dba](https://bitbucket.org/enturas/design-system/commits/7a12dbafc4a2bfdf4fff9684d7eb28ff13b06329))
- fixing styling of timepicker component ([0f721db](https://bitbucket.org/enturas/design-system/commits/0f721db28057d8789686df06ef6624f51310df48))
- remove popper arrow for datepicker ([5f169e1](https://bitbucket.org/enturas/design-system/commits/5f169e1eddb6f1bb89631cbb697e76f74bb7e421))
- similar styling for datepicker in normal and contrast ([2697b66](https://bitbucket.org/enturas/design-system/commits/2697b6681347b92a00a1d380680995e8f15dfd26))

### Features

- adding native timepicker ([205a3de](https://bitbucket.org/enturas/design-system/commits/205a3de6d2d302e22676443753a50be2e0b0912a))
- adding the timepicker component ([6279a95](https://bitbucket.org/enturas/design-system/commits/6279a9506f69838e0c8691b58bc1d2e774235fdd))

## [0.2.5](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.2.4...@entur/datepicker@0.2.5) (2020-01-14)

**Note:** Version bump only for package @entur/datepicker

## [0.2.4](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.2.3...@entur/datepicker@0.2.4) (2020-01-13)

### Bug Fixes

- fix offset of datepicker to align with input ([ee68af2](https://bitbucket.org/enturas/design-system/commits/ee68af2111b475692dfec6f47461083c730b3004))

## [0.2.3](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.2.2...@entur/datepicker@0.2.3) (2020-01-10)

**Note:** Version bump only for package @entur/datepicker

## [0.2.2](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.2.1...@entur/datepicker@0.2.2) (2020-01-08)

### Bug Fixes

- warn in development if the developer have forgotten the CSS ([e5c30fc](https://bitbucket.org/enturas/design-system/commits/e5c30fc08624ef22c02773892778abd92205c6b0))

## [0.2.1](https://bitbucket.org/enturas/design-system/compare/@entur/datepicker@0.2.0...@entur/datepicker@0.2.1) (2020-01-06)

**Note:** Version bump only for package @entur/datepicker

# 0.2.0 (2019-12-20)

### Bug Fixes

- finalizing styling for datepicker components ([b73888d](https://bitbucket.org/enturas/design-system/commits/b73888db97eb9ef815042b61006cccc103167c04))

### Features

- add datepicker package and component ([c016cbe](https://bitbucket.org/enturas/design-system/commits/c016cbef7dc01b09b60d2e123bef55de80c24b82))
- adding native datepicker ([7eb290f](https://bitbucket.org/enturas/design-system/commits/7eb290f73a364d446e26fcd68343cd39c2f4cdd0))
