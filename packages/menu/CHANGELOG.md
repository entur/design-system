# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.1](https://bitbucket.org/enturas/design-system/compare/@entur/menu@1.2.0...@entur/menu@1.2.1) (2020-01-08)

### Bug Fixes

- warn in development if the developer have forgotten the CSS ([e5c30fc](https://bitbucket.org/enturas/design-system/commits/e5c30fc08624ef22c02773892778abd92205c6b0))

# [1.2.0](https://bitbucket.org/enturas/design-system/compare/@entur/menu@1.1.0...@entur/menu@1.2.0) (2020-01-06)

### Bug Fixes

- **Pagination:** fix ios safari bug with small prev/next buttons ([c3c06d4](https://bitbucket.org/enturas/design-system/commits/c3c06d408e994a14d94d1536da86111327e55fbb))
- **Pagination:** make each pagination page text unselectable ([746fc7a](https://bitbucket.org/enturas/design-system/commits/746fc7ab6a2e6348a0a5e03f4c8c0000f9ed75b2))

### Features

- **BreadcrumbNavigation, BreadcrumbItem:** create new components for composing breadcrumbs together ([37c3e5e](https://bitbucket.org/enturas/design-system/commits/37c3e5e897d222d65e0ce51fceae9693788a0f0f))
- **Breadcrumbs:** add new component - Breadcrumbs ([0ee248d](https://bitbucket.org/enturas/design-system/commits/0ee248d7ac936904eaf9dbc324197d4bb44b498e))

# [1.1.0](https://bitbucket.org/enturas/design-system/compare/@entur/menu@1.0.3...@entur/menu@1.1.0) (2019-12-20)

### Features

- **Pagination:** add new component - Pagination ([bc6d042](https://bitbucket.org/enturas/design-system/commits/bc6d0427041a784a42ae028ebffc6271e5ab5a67))
- **Pagination:** add support for showInput ([588d9f3](https://bitbucket.org/enturas/design-system/commits/588d9f31c769298e1b6d8d2aee3c97b5e308b4fe))

## [1.0.3](https://bitbucket.org/enturas/design-system/compare/@entur/menu@1.0.2...@entur/menu@1.0.3) (2019-12-10)

### Bug Fixes

- **border left:** fixing skewed left border on active item ([fd69f56](https://bitbucket.org/enturas/design-system/commits/fd69f565355ad8e61bdb70b001a5393d866dc599))
- **disabled sidemenu:** spreading props on component if SideNavigationItem is disabled ([0a4125a](https://bitbucket.org/enturas/design-system/commits/0a4125a503a1cade6dfd8df5ae5beeed132d5b32))
- **disabled sidemenuitem:** proper props spread, and aria-disabled label ([15a578d](https://bitbucket.org/enturas/design-system/commits/15a578d1872c14cccf4a8d19ee3e018d511caf8a))
- adding default prop as part of documentation ([1ef7510](https://bitbucket.org/enturas/design-system/commits/1ef75107362f6262429d7fe31519b4353eccc8de))

## [1.0.2](https://bitbucket.org/enturas/design-system/compare/@entur/menu@1.0.1...@entur/menu@1.0.2) (2019-11-29)

**Note:** Version bump only for package @entur/menu

## [1.0.1](https://bitbucket.org/enturas/design-system/compare/@entur/menu@1.0.0...@entur/menu@1.0.1) (2019-11-28)

### Bug Fixes

- **SideNavigationGroup:** reduce vertical padding between elements ([3a4131a](https://bitbucket.org/enturas/design-system/commits/3a4131a957634a46dcd29870cb301542fecdb6dc))

# [1.0.0](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.5.0...@entur/menu@1.0.0) (2019-11-22)

### Bug Fixes

- **Menu:** fix issue where an empty menu was rendered ([360d3b0](https://bitbucket.org/enturas/design-system/commits/360d3b03a2803981b9f9c44565a05c0a4467c7f1))

### Code Refactoring

- **Menu, MenuItem, MenuGroup:** rename to SideNavigation, -Item and -Group ([61fd869](https://bitbucket.org/enturas/design-system/commits/61fd8698b9c32eaeae4e9521237609b09201dac9))
- **NavBarItem:** rename to TopNavigationItem ([56a219c](https://bitbucket.org/enturas/design-system/commits/56a219c8f58137c34e72878fa1672ec99a1338ad))

### Features

- **MenuItem:** require MenuItems to be links ([caa5798](https://bitbucket.org/enturas/design-system/commits/caa57987f134322f33249d109286e4ae109ff1cf))
- **types:** exporting all public types for public components ([4a277ab](https://bitbucket.org/enturas/design-system/commits/4a277ab266fdb32a6760821a07b1c6cc716bac85))

### BREAKING CHANGES

- **NavBarItem:** NavBarItem is renamed to TopNavigationItem, but maintains the same API
- **Menu, MenuItem, MenuGroup:** Menu, MenuItem and MenuGroup is renamed, but maintains the same APIs
- **MenuItem:** MenuItem now needs to be a link to a landing page

# [0.5.0](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.4.2...@entur/menu@0.5.0) (2019-11-18)

### Bug Fixes

- add explicit import of expand styling ([a90e9ed](https://bitbucket.org/enturas/design-system/commits/a90e9ed06ddf3dae6a225c7a05923978844292b4))
- add missing type="button" to sub menu togglers ([2a47e90](https://bitbucket.org/enturas/design-system/commits/2a47e90fd72d03db17a2b5d656546266fdc0574b))
- ignore as prop on MenuItems with sub menus ([56c5216](https://bitbucket.org/enturas/design-system/commits/56c5216d21dffc00220f1bb9ed52d6ad9655341a))
- make sure the typography is correct for all menus ([b4fc9ce](https://bitbucket.org/enturas/design-system/commits/b4fc9ce120cbf0dcf0ffef67356cf80891a5a7ca))
- verify that a child element is an entur menu the correct way ([a3e766f](https://bitbucket.org/enturas/design-system/commits/a3e766fba398891bc664fac54bada81d1352d40b))

### Features

- adding new component -> NavBarItem ([70d3af0](https://bitbucket.org/enturas/design-system/commits/70d3af0d02c1847596354242ddc293212b311e4a))

## [0.4.2](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.4.1...@entur/menu@0.4.2) (2019-11-14)

### Bug Fixes

- **docs:** fix bug in sidebar for when the menu prop is a string ([ea2f2d9](https://bitbucket.org/enturas/design-system/commits/ea2f2d987f8fee90b6af40c94953dc773f9eaccf))
- add missing dependencies to dependency arrays ([15f1e81](https://bitbucket.org/enturas/design-system/commits/15f1e81f5a3dfea3e60453195379d392e6d536a0))
- **css classnames:** fixing naming collisions with CSS classes ([a93ca43](https://bitbucket.org/enturas/design-system/commits/a93ca435d3a01d61d8f02694a672686b9e943a66))

## [0.4.1](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.4.0...@entur/menu@0.4.1) (2019-11-07)

**Note:** Version bump only for package @entur/menu

# [0.4.0](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.3.1...@entur/menu@0.4.0) (2019-11-06)

### Bug Fixes

- **MenuGroup:** add 1 px letter spacing to menu group label ([93b46fa](https://bitbucket.org/enturas/design-system/commits/93b46fa034d96d5bda22a4a279ad2563c3d8e34b))
- **MenuGroup:** add margin between menu groups ([3bd10ff](https://bitbucket.org/enturas/design-system/commits/3bd10ffcf84712f119f50165a753a43444ea209d))

### Features

- add new component MenuGroup ([1f5b6f1](https://bitbucket.org/enturas/design-system/commits/1f5b6f1a2f40146a22e71cc6f71e3157f6a7ab9c))

## [0.3.1](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.3.0...@entur/menu@0.3.1) (2019-11-04)

### Bug Fixes

- **Menu:** make sub menu detection work more consistently ([096538e](https://bitbucket.org/enturas/design-system/commits/096538e83714261398379e56d31704a59c7324fc))

# [0.3.0](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.2.3...@entur/menu@0.3.0) (2019-10-30)

### Bug Fixes

- migrate to latest version of space tokens ([4330496](https://bitbucket.org/enturas/design-system/commits/4330496e269bf628f7b9b7aec75f704800201101))
- update all packages to use new tokens ([4847835](https://bitbucket.org/enturas/design-system/commits/48478359b0e562ba828e06d9b5c57239316805c2))

### Features

- **MenuItem:** add new prop forceExpandSubMenus ([c6c307d](https://bitbucket.org/enturas/design-system/commits/c6c307d045838c1d938da5bf162baa5cda300c5b))

## [0.2.3](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.2.2...@entur/menu@0.2.3) (2019-10-22)

**Note:** Version bump only for package @entur/menu

## [0.2.2](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.2.1...@entur/menu@0.2.2) (2019-10-11)

### Bug Fixes

- **menu:** set max-width for menus on desktop ([476b56e](https://bitbucket.org/enturas/design-system/commits/476b56e))

## [0.2.1](https://bitbucket.org/enturas/design-system/compare/@entur/menu@0.2.0...@entur/menu@0.2.1) (2019-10-07)

### Bug Fixes

- **menu:** lock React version to 16.9.x ([9d6fc2b](https://bitbucket.org/enturas/design-system/commits/9d6fc2b))
- **menu:** make icons show up in the correct place and color ([6b54369](https://bitbucket.org/enturas/design-system/commits/6b54369))

# 0.2.0 (2019-09-25)

### Bug Fixes

- add explicit dependency on classnames package ([8f491ac](https://bitbucket.org/enturas/design-system/commits/8f491ac))
- make sure disabled links are actually disabled ([645ffed](https://bitbucket.org/enturas/design-system/commits/645ffed))

### Features

- add a new package "menu" ([24365ff](https://bitbucket.org/enturas/design-system/commits/24365ff))
