# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://bitbucket.org/enturas/design-system/compare/@entur/designsystem-docs@2.1.0...@entur/designsystem-docs@3.0.0) (2019-11-04)

### Bug Fixes

- **docs:** add missing ImportStatement import statement ([034b00d](https://bitbucket.org/enturas/design-system/commits/034b00de7ffaa056cf5026bd018ee723471ebbed))

### Code Refactoring

- **InputGroup:** rename FormGroup to InputGroup ([520281d](https://bitbucket.org/enturas/design-system/commits/520281d8dc461c73fb533db92ceed0ebf40a1823))
- **InputGroup:** rename FormGroup to InputGroup ([725f121](https://bitbucket.org/enturas/design-system/commits/725f121f9597310a1c4f9e46501eeef1c8a82829))

### Features

- **Expand:** adding Expandable, ControlledExpandable component in expand package ([d469df0](https://bitbucket.org/enturas/design-system/commits/d469df03e3da6e70e206746debc5ec0a11d18af1))
- **SmallAlertBox:** add width="fit-content" option ([1f4d327](https://bitbucket.org/enturas/design-system/commits/1f4d32763a65bbe2a70f814f9ca9377a737f53ca))

### BREAKING CHANGES

- **InputGroup:** Rename FormGroup to InputGroup
- **InputGroup:** FormGroup is now known as InputGroup. Change your imports. Also, variant="none" is not a valid form
  control variant - pass null instead.

# [2.1.0](https://bitbucket.org/enturas/design-system/compare/@entur/designsystem-docs@2.0.0...@entur/designsystem-docs@2.1.0) (2019-10-30)

### Bug Fixes

- migrate to latest version of space tokens ([4330496](https://bitbucket.org/enturas/design-system/commits/4330496e269bf628f7b9b7aec75f704800201101))
- update all packages to use new tokens ([4847835](https://bitbucket.org/enturas/design-system/commits/48478359b0e562ba828e06d9b5c57239316805c2))
- **docs:** remove divider between colors ([85b10eb](https://bitbucket.org/enturas/design-system/commits/85b10eb25dc5fc756f89c7e948ef460cf1afcdb8))
- **menu:** make the search bar filter the menu correctly ([4e02469](https://bitbucket.org/enturas/design-system/commits/4e024698b1f444584df6f4f6ad8d252c8e2df72f))
- **Props:** fix bug where settings weren't respected ([288870c](https://bitbucket.org/enturas/design-system/commits/288870caad68baa2fc089235e48753c517d318d5))

### Features

- **docs:** add import statements all over the code ([6921110](https://bitbucket.org/enturas/design-system/commits/6921110c0d55976cec604f3cd6da31a708fb7871))
- **docs:** add new ImportStatement component ([0e48c4c](https://bitbucket.org/enturas/design-system/commits/0e48c4c3b959a4a2091d5eb8e260fa0060184032))
- **docs:** add token overview ([6cabfe6](https://bitbucket.org/enturas/design-system/commits/6cabfe60744296786f590d49b34615f03d26435c))
- **modal:** add new package @entur/modal ([642e78c](https://bitbucket.org/enturas/design-system/commits/642e78cac1f4db4e63ac3c202405c9876b68ff4a))
- **settings:** start using modal component for settings in docs ([9acadcc](https://bitbucket.org/enturas/design-system/commits/9acadccad387a9725552203b62c624467c809ca6))
- **table:** add new option "compact" to Table component ([6de5abd](https://bitbucket.org/enturas/design-system/commits/6de5abdc3655fb72b3595c447d814b3e51e30e17))

# [2.0.0](https://bitbucket.org/enturas/design-system/compare/@entur/designsystem-docs@1.0.0...@entur/designsystem-docs@2.0.0) (2019-10-22)

### Bug Fixes

- **docs:** align the "Endre side" content to the right of the site footer ([684af44](https://bitbucket.org/enturas/design-system/commits/684af447c01d0405c1cbb02bdd7e5b2a2b99dd54))
- **docs:** fix bug where settings were flashed as their initial value ([706aacf](https://bitbucket.org/enturas/design-system/commits/706aacfa032a52efb0ef2920ad72bcb9c102ac33))
- **docs:** there were fnutts that weren't supposed to be there ([7b8531d](https://bitbucket.org/enturas/design-system/commits/7b8531dd9f34c1d19b491d3bfcde255750111cb5))
- **tooltip:** using Entur Button in tooltip documentation ([a1abfb2](https://bitbucket.org/enturas/design-system/commits/a1abfb2c6fa9e39e8bb1c5e6ac6fffb0e9153ad7))

### Code Refactoring

- **tooltip:** use named exports instead of default exports ([ad487aa](https://bitbucket.org/enturas/design-system/commits/ad487aa63a591fa979b7d57cb804426cc54ed3b7))

### Features

- **docs:** add "copy color" feature to color swatches ([dcc2b01](https://bitbucket.org/enturas/design-system/commits/dcc2b013651d90dbf263fd3687d54d4e1a69263c))
- **docs:** add edit page feature ([d4823b3](https://bitbucket.org/enturas/design-system/commits/d4823b3313a0be098a7758acf49ac90521ce8a33))
- **docs:** add info for developers on how to get started ([2fe4162](https://bitbucket.org/enturas/design-system/commits/2fe41623376938ecb7a6a87f79220b0caaca10a7))
- **docs:** add props component ([aa21c10](https://bitbucket.org/enturas/design-system/commits/aa21c1051ddc2a0dbe13190e1a622499eecd32a1))
- **docs:** add settings ([33e5e56](https://bitbucket.org/enturas/design-system/commits/33e5e568d4d01ac1f5af092ff54f01cccd9b4ab6))
- **docs:** added install and import code examples for components ([3947218](https://bitbucket.org/enturas/design-system/commits/394721862f307913a7e553ee9266ad335bb98d7d))
- **docs:** show a toast every time an icon is copied ([3afc5d1](https://bitbucket.org/enturas/design-system/commits/3afc5d12092bb65317ffd15ba5d00d75625cfbf4))
- **docs:** start using new CodeText component in MDX ([73918a3](https://bitbucket.org/enturas/design-system/commits/73918a35a515997a61829fa707f464fc665c17a1))
- **icons:** Add inline and extra class support ([50dc694](https://bitbucket.org/enturas/design-system/commits/50dc694063585c4c39618bf38f1c0d2a87a3319e))
- **Props:** show code values with new CodeText component ([339d7f8](https://bitbucket.org/enturas/design-system/commits/339d7f8ba1942438bb667eb54a79fd1ba21efba3))
- **Props:** skip showing default value column if no default values ([df898c9](https://bitbucket.org/enturas/design-system/commits/df898c984f2ae107fbe4fd2a5060c687f7b8f7c3))
- **settings:** added NPM/yarn settings ([92e4d54](https://bitbucket.org/enturas/design-system/commits/92e4d545500ca8e99aea1cfbf0f96f0f6d16e7a4))
- **small typography:** added Small typography and documentation ([f2c6a0a](https://bitbucket.org/enturas/design-system/commits/f2c6a0a108b177efad32ca0fec0733a2072bd9d1))
- **table:** new package @entur/table ([45d7e3b](https://bitbucket.org/enturas/design-system/commits/45d7e3b151b6ff4e59bf58d776da5b45df34f196))

### BREAKING CHANGES

- **tooltip:** Change from default export to named export (Tooltip)

# [1.0.0](https://bitbucket.org/enturas/design-system/compare/@entur/designsystem-docs@0.3.0...@entur/designsystem-docs@1.0.0) (2019-10-11)

### Bug Fixes

- size property is proper height ([b8d88d2](https://bitbucket.org/enturas/design-system/commits/b8d88d2))
- **docs:** add images to icon best practices ([6af364c](https://bitbucket.org/enturas/design-system/commits/6af364c))
- **docs:** display variables correctly ([e9b89a8](https://bitbucket.org/enturas/design-system/commits/e9b89a8))
- **docs:** fix missing slash in path ([e94e46e](https://bitbucket.org/enturas/design-system/commits/e94e46e))
- **docs:** make copy and show code options always show up to the right ([4c369e5](https://bitbucket.org/enturas/design-system/commits/4c369e5))
- **docs:** make icon documentation responsive ([fabc814](https://bitbucket.org/enturas/design-system/commits/fabc814))
- **docs:** remove the contrast option for menus ([5549fb3](https://bitbucket.org/enturas/design-system/commits/5549fb3))
- **docs Searchbar:** focus to previous Element on escape ([dc4e60c](https://bitbucket.org/enturas/design-system/commits/dc4e60c))
- **Searchbar:** escape key without previousRef bug ([c295b50](https://bitbucket.org/enturas/design-system/commits/c295b50))

### Features

- **docs:** add Divider component ([a806c6b](https://bitbucket.org/enturas/design-system/commits/a806c6b))
- **docs:** add root import ([bf735a1](https://bitbucket.org/enturas/design-system/commits/bf735a1))
- **docs:** implement a new and fancy doc site for our colors ([1a220c1](https://bitbucket.org/enturas/design-system/commits/1a220c1))
- **docs:** redesign and add info about icons ([d3060bb](https://bitbucket.org/enturas/design-system/commits/d3060bb))
- **form:** formGroup component for input components ([844612f](https://bitbucket.org/enturas/design-system/commits/844612f))
- **input:** textField component added ([d486047](https://bitbucket.org/enturas/design-system/commits/d486047))
- **searchbar:** searchbar in docs to search across documentation ([e051843](https://bitbucket.org/enturas/design-system/commits/e051843))

### BREAKING CHANGES

- Width=medium|large removed

# [0.3.0](https://bitbucket.org/enturas/design-system/compare/@entur/designsystem-docs@0.2.0...@entur/designsystem-docs@0.3.0) (2019-10-07)

### Bug Fixes

- **docs:** add missing slash to route ([8141588](https://bitbucket.org/enturas/design-system/commits/8141588))
- **docs:** add option of spreading props to the input element inside toggle ([618e00e](https://bitbucket.org/enturas/design-system/commits/618e00e))
- **docs:** fix broken scss in docs code ([25f73f4](https://bitbucket.org/enturas/design-system/commits/25f73f4))
- **docs:** make sure the TOC component has space to shine ([da8ef0d](https://bitbucket.org/enturas/design-system/commits/da8ef0d))
- **docs:** remove unused prop and dead comment ([34930cd](https://bitbucket.org/enturas/design-system/commits/34930cd))
- **docs:** use a pointer icon when hovering the playground controls ([1ba7d2e](https://bitbucket.org/enturas/design-system/commits/1ba7d2e))
- **docs:** use the correct style for the contrast switch label ([8d6c496](https://bitbucket.org/enturas/design-system/commits/8d6c496))
- **menu:** lock React version to 16.9.x ([9d6fc2b](https://bitbucket.org/enturas/design-system/commits/9d6fc2b))

### Features

- **componentruler:** component Ruler helper component, for measuring components ([03f98f2](https://bitbucket.org/enturas/design-system/commits/03f98f2))
- **docs:** add contrast toggle to playgrounds ([096d585](https://bitbucket.org/enturas/design-system/commits/096d585))
- **docs:** implement a table of content component ([7d38a13](https://bitbucket.org/enturas/design-system/commits/7d38a13))
- **docs:** re-implement the react-live integration ([275138e](https://bitbucket.org/enturas/design-system/commits/275138e))
- **docs component:** added a component presenter ([a5a7133](https://bitbucket.org/enturas/design-system/commits/a5a7133))
- **layout:** add new package layout ([3ab2559](https://bitbucket.org/enturas/design-system/commits/3ab2559))

# [0.2.0](https://bitbucket.org/enturas/design-system/compare/@entur/designsystem-docs@0.1.0...@entur/designsystem-docs@0.2.0) (2019-09-26)

### Features

- add new alert package ([52e0b03](https://bitbucket.org/enturas/design-system/commits/52e0b03))
- **alert:** add new prop \`closable\` ([ae80e40](https://bitbucket.org/enturas/design-system/commits/ae80e40))

# 0.1.0 (2019-09-25)

### Bug Fixes

- added tooltip on child-focus ([df9921d](https://bitbucket.org/enturas/design-system/commits/df9921d))
- working menu system with nesting ([e9730a6](https://bitbucket.org/enturas/design-system/commits/e9730a6))

### Features

- add a new package "menu" ([24365ff](https://bitbucket.org/enturas/design-system/commits/24365ff))
- **docs:** do-and-dont component for documentation ([9915e64](https://bitbucket.org/enturas/design-system/commits/9915e64))
- **icons:** add new package icons ([48500ae](https://bitbucket.org/enturas/design-system/commits/48500ae))
- **tokens:** add new package "tokens" ([680d062](https://bitbucket.org/enturas/design-system/commits/680d062))
