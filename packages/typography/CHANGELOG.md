# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.3](https://bitbucket.org/enturas/design-system/compare/@entur/typography@1.1.2...@entur/typography@1.1.3) (2020-03-20)

**Note:** Version bump only for package @entur/typography

## [1.1.2](https://bitbucket.org/enturas/design-system/compare/@entur/typography@1.1.1...@entur/typography@1.1.2) (2020-03-18)

**Note:** Version bump only for package @entur/typography

## [1.1.1](https://bitbucket.org/enturas/design-system/compare/@entur/typography@1.1.0...@entur/typography@1.1.1) (2020-02-20)

### Bug Fixes

- readjusting typography for small surfaces ([033ecaa](https://bitbucket.org/enturas/design-system/commits/033ecaad78be039b0290dbacba80604b502cd4cd))

# [1.1.0](https://bitbucket.org/enturas/design-system/compare/@entur/typography@1.0.3...@entur/typography@1.1.0) (2020-02-14)

### Bug Fixes

- fix typo in fonts import ([f2430ab](https://bitbucket.org/enturas/design-system/commits/f2430abf8a2cc0e1def2dabd85068cf511236ba7))
- update fonts with new entur watermarked fonts ([97de7b7](https://bitbucket.org/enturas/design-system/commits/97de7b761ea044faafc8efc8f423bee92e94b279))

### Features

- **fonts:** include web fonts in the typography package directly ([5043c27](https://bitbucket.org/enturas/design-system/commits/5043c27e88fc943d14b2950ac28d86b64eec819c))

### Reverts

- revert config changes ([53076fd](https://bitbucket.org/enturas/design-system/commits/53076fd1ef1c02bbd1c426a172562091b585c88d))

## [1.0.3](https://bitbucket.org/enturas/design-system/compare/@entur/typography@1.0.2...@entur/typography@1.0.3) (2020-02-10)

### Bug Fixes

- better font sizes for smaller screens ([721fe06](https://bitbucket.org/enturas/design-system/commits/721fe062652df71c6520acd58a839310b2a4807f))
- update colors for preformatted and code text ([846d144](https://bitbucket.org/enturas/design-system/commits/846d144df0402bbc27bfd6997aba2db59303c85d))

## [1.0.2](https://bitbucket.org/enturas/design-system/compare/@entur/typography@1.0.1...@entur/typography@1.0.2) (2020-02-05)

### Bug Fixes

- remove test-files from build process ([e0b24af](https://bitbucket.org/enturas/design-system/commits/e0b24af05d5c2ad8de4ae587d83c389495235890))

## [1.0.1](https://bitbucket.org/enturas/design-system/compare/@entur/typography@1.0.0...@entur/typography@1.0.1) (2020-01-28)

**Note:** Version bump only for package @entur/typography

# [1.0.0](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.7.4...@entur/typography@1.0.0) (2020-01-27)

### Bug Fixes

- add marigin prop for paragraph component ([c7c932a](https://bitbucket.org/enturas/design-system/commits/c7c932ac057e9c393200b6f84093ea62966fa6bd))
- ensure proper usage of margin props for paragraph ([c3fd065](https://bitbucket.org/enturas/design-system/commits/c3fd06501973537c5b6318cdd6a6090f88bce33d))
- updating margins for header and paragraph components ([a7cc7a0](https://bitbucket.org/enturas/design-system/commits/a7cc7a0cb15100613e4edca89fa18424c59d7987))
- **types:** place types in the correct place ([acace09](https://bitbucket.org/enturas/design-system/commits/acace09ec0e258c5cff3a65e13ab29d6603780d9))
- updating marigins for all typography components ([29e9a27](https://bitbucket.org/enturas/design-system/commits/29e9a273c6c45a7a417f59b59e9ec91971d72e8a))

### BREAKING CHANGES

- as some typography components now have either removed or added marign,
  if these have been used directly in components or other places where
  their margins were used for styling purposes, you may experience issues
  with this. So doublecheck your usage of Heading1-6 and Paragraph in places
  where their margins may be interferring

## [0.7.4](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.7.3...@entur/typography@0.7.4) (2020-01-20)

### Bug Fixes

- fixing use of fallback font, and adding font family as css variable ([a4d28c4](https://bitbucket.org/enturas/design-system/commits/a4d28c42768a2b8d6faee4565a9fe6b9be7034f9))

## [0.7.3](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.7.2...@entur/typography@0.7.3) (2020-01-14)

**Note:** Version bump only for package @entur/typography

## [0.7.2](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.7.1...@entur/typography@0.7.2) (2020-01-13)

### Bug Fixes

- **Typography:** added var() ([02ea259](https://bitbucket.org/enturas/design-system/commits/02ea2594c9064484eebb06529887c4e34c8479c7))
- **Typography:** switched color: inherit with css prop ([ccd3a04](https://bitbucket.org/enturas/design-system/commits/ccd3a046b78be146f1b136211f4a3e92c7e31df9))

## [0.7.1](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.7.0...@entur/typography@0.7.1) (2020-01-08)

### Bug Fixes

- warn in development if the developer have forgotten the CSS ([e5c30fc](https://bitbucket.org/enturas/design-system/commits/e5c30fc08624ef22c02773892778abd92205c6b0))

# [0.7.0](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.6.1...@entur/typography@0.7.0) (2020-01-06)

### Bug Fixes

- new styling for preformatted and code text ([c929097](https://bitbucket.org/enturas/design-system/commits/c9290975269797e8080362336b9d2cac65e028e9))

### Features

- **UnorderedList, NumberedList, ListItem:** add new list components ([96de00e](https://bitbucket.org/enturas/design-system/commits/96de00e21d852702e1ab23d388a807d5ad035580))

## [0.6.1](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.6.0...@entur/typography@0.6.1) (2019-12-10)

### Bug Fixes

- fixing the api for the margin-prop, used in headers ([85e04d3](https://bitbucket.org/enturas/design-system/commits/85e04d3db248a66ec6b05ad85ba02ef7438f76e8))

# [0.6.0](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.5.0...@entur/typography@0.6.0) (2019-11-29)

### Features

- **Heading1-6:** add margin prop to all headings ([a167485](https://bitbucket.org/enturas/design-system/commits/a1674852143e8a99bff7c2dbebf20ff09aeea977))

# [0.5.0](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.4.5...@entur/typography@0.5.0) (2019-11-22)

### Features

- **types:** exporting all public types for public components ([4a277ab](https://bitbucket.org/enturas/design-system/commits/4a277ab266fdb32a6760821a07b1c6cc716bac85))

## [0.4.5](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.4.4...@entur/typography@0.4.5) (2019-11-18)

### Bug Fixes

- add custom styles for h6 headings ([4f8e643](https://bitbucket.org/enturas/design-system/commits/4f8e6433f05f51f3db3c2be2b6aeb08b52d94931))
- **type:** fix broken types due to duplicate declarations ([01e4e21](https://bitbucket.org/enturas/design-system/commits/01e4e215c57b3a812c79d69ded2834401c35d4fe))

## [0.4.4](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.4.3...@entur/typography@0.4.4) (2019-11-14)

### Bug Fixes

- fix lint errors ([8539282](https://bitbucket.org/enturas/design-system/commits/8539282c04b01cc1459109cbc9c4111dfcdaa5f4))
- **css classnames:** fixing naming collisions with CSS classes ([a93ca43](https://bitbucket.org/enturas/design-system/commits/a93ca435d3a01d61d8f02694a672686b9e943a66))
- **headings:** skip setting horizontal margins for headings ([a94f54a](https://bitbucket.org/enturas/design-system/commits/a94f54a92a65f2939438c6a8f8be895bd64a99d2))

## [0.4.3](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.4.2...@entur/typography@0.4.3) (2019-11-07)

### Bug Fixes

- fix issue where fallback font was used ([8c31176](https://bitbucket.org/enturas/design-system/commits/8c31176ded49432692820d6cbcfcf07d784e88fc))

## [0.4.2](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.4.1...@entur/typography@0.4.2) (2019-11-06)

### Bug Fixes

- **CodeText:** add border to inline code text component ([83b76ae](https://bitbucket.org/enturas/design-system/commits/83b76aefce6c8972208cae8652b89ae84c763b12))
- **PreformattedText:** add border ([8bc0b47](https://bitbucket.org/enturas/design-system/commits/8bc0b477b7a213f87aa1af169d6fa48363514419))

## [0.4.1](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.4.0...@entur/typography@0.4.1) (2019-10-30)

### Bug Fixes

- migrate to latest version of space tokens ([4330496](https://bitbucket.org/enturas/design-system/commits/4330496e269bf628f7b9b7aec75f704800201101))
- update all packages to use new tokens ([4847835](https://bitbucket.org/enturas/design-system/commits/48478359b0e562ba828e06d9b5c57239316805c2))
- **Link:** let links inherit the font-size ([83a2db5](https://bitbucket.org/enturas/design-system/commits/83a2db57c52c466f5c97d1a8f41d6315eb496bb1))

# [0.4.0](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.3.0...@entur/typography@0.4.0) (2019-10-22)

### Features

- **docs:** added install and import code examples for components ([3947218](https://bitbucket.org/enturas/design-system/commits/394721862f307913a7e553ee9266ad335bb98d7d))
- **small typography:** added Small typography and documentation ([f2c6a0a](https://bitbucket.org/enturas/design-system/commits/f2c6a0a108b177efad32ca0fec0733a2072bd9d1))
- **typography:** add new component - CodeText ([474721d](https://bitbucket.org/enturas/design-system/commits/474721dac9ca84b0d1ecfb7a93ad339ba0653184))

# [0.3.0](https://bitbucket.org/enturas/design-system/compare/@entur/typography@0.2.0...@entur/typography@0.3.0) (2019-10-07)

### Bug Fixes

- **typography:** add wildcard type definition to all typography types ([b2ebb9e](https://bitbucket.org/enturas/design-system/commits/b2ebb9e))

### Features

- **typography:** add LeadParagraph component ([64a4352](https://bitbucket.org/enturas/design-system/commits/64a4352))
- **typography:** add new component \`PreformattedText\` ([6e8dc24](https://bitbucket.org/enturas/design-system/commits/6e8dc24))

# 0.2.0 (2019-09-25)

### Features

- **typography:** add new package typography ([dca4b0c](https://bitbucket.org/enturas/design-system/commits/dca4b0c))
- **typography:** implement a basic typography package ([a1da1ae](https://bitbucket.org/enturas/design-system/commits/a1da1ae))
