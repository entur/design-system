# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.2.0](https://bitbucket.org/enturas/design-system/compare/@entur/form@1.1.0...@entur/form@1.2.0) (2019-11-22)

### Bug Fixes

- fixing potential duplication of props naming ([6efd896](https://bitbucket.org/enturas/design-system/commits/6efd896d381bca09bc047dbdaec6d2629a9571db))
- **InputGroup:** increase the size of the feedback icon ([fc543b0](https://bitbucket.org/enturas/design-system/commits/fc543b01fb9365140b6ee23e0031cde746155b44))

### Features

- **types:** exporting all public types for public components ([4a277ab](https://bitbucket.org/enturas/design-system/commits/4a277ab266fdb32a6760821a07b1c6cc716bac85))

# [1.1.0](https://bitbucket.org/enturas/design-system/compare/@entur/form@1.0.3...@entur/form@1.1.0) (2019-11-18)

### Bug Fixes

- add hover-effect for form elements in contrast sections ([a9da726](https://bitbucket.org/enturas/design-system/commits/a9da7266d9500b39aa69da39b57e50ab55a8a6e4))

### Features

- add readOnly prop to Dropdown, TextField and TextArea components ([ac26116](https://bitbucket.org/enturas/design-system/commits/ac26116338dce15bc23fe0fb9582f95c67c9c6e2))

## [1.0.3](https://bitbucket.org/enturas/design-system/compare/@entur/form@1.0.2...@entur/form@1.0.3) (2019-11-14)

### Bug Fixes

- make form controls expand to the size of its container ([df4ff54](https://bitbucket.org/enturas/design-system/commits/df4ff546d6911cedea21e025f3ff30f703cdcc18))
- **checkbox:** change types to work with newest typescript ([090d933](https://bitbucket.org/enturas/design-system/commits/090d933b7b55ac6a5882e53e652d0e94c853c31f))
- **css classnames:** fixing naming collisions with CSS classes ([a93ca43](https://bitbucket.org/enturas/design-system/commits/a93ca435d3a01d61d8f02694a672686b9e943a66))

## [1.0.2](https://bitbucket.org/enturas/design-system/compare/@entur/form@1.0.1...@entur/form@1.0.2) (2019-11-07)

### Bug Fixes

- **FormControl:** fixing spacing on prepend and append ([0837844](https://bitbucket.org/enturas/design-system/commits/0837844247cfcbffc99f1bb6aeb7b74cddb0c8c7))

## [1.0.1](https://bitbucket.org/enturas/design-system/compare/@entur/form@1.0.0...@entur/form@1.0.1) (2019-11-06)

**Note:** Version bump only for package @entur/form

# [1.0.0](https://bitbucket.org/enturas/design-system/compare/@entur/form@0.4.0...@entur/form@1.0.0) (2019-11-04)

### Code Refactoring

- **Dropdown, TextArea, TextField:** rewrite form field implementation ([0b6b9d0](https://bitbucket.org/enturas/design-system/commits/0b6b9d0d87c712366e05b6a275eea406f1a5cdb9))
- **InputGroup:** rename FormGroup to InputGroup ([520281d](https://bitbucket.org/enturas/design-system/commits/520281d8dc461c73fb533db92ceed0ebf40a1823))
- **InputGroup:** rename FormGroup to InputGroup ([725f121](https://bitbucket.org/enturas/design-system/commits/725f121f9597310a1c4f9e46501eeef1c8a82829))

### BREAKING CHANGES

- **InputGroup:** Rename FormGroup to InputGroup
- **InputGroup:** FormGroup is now known as InputGroup. Change your imports. Also, variant="none" is not a valid form
  control variant - pass null instead.
- **Dropdown, TextArea, TextField:** Removes width prop (now fluid by default)

# [0.4.0](https://bitbucket.org/enturas/design-system/compare/@entur/form@0.3.0...@entur/form@0.4.0) (2019-10-30)

### Bug Fixes

- **FormGroup:** give adjacent form groups some margin between them ([4acc478](https://bitbucket.org/enturas/design-system/commits/4acc478f1d8f71fafaed14dc7f135ea16e4533ee))
- migrate to latest version of space tokens ([4330496](https://bitbucket.org/enturas/design-system/commits/4330496e269bf628f7b9b7aec75f704800201101))
- update all packages to use new tokens ([4847835](https://bitbucket.org/enturas/design-system/commits/48478359b0e562ba828e06d9b5c57239316805c2))
- **FormGroup:** make FormGroup component a block element and add default space between ([56d2b6b](https://bitbucket.org/enturas/design-system/commits/56d2b6bfcd7fbed77078b1c4bf9cdaa533b0d078))
- **FormGroup:** removing feedback if variant is set to 'none' ([21fe9e2](https://bitbucket.org/enturas/design-system/commits/21fe9e27f78789d158eb54ebce599b254cd91aaa))
- **FormGroup:** removing required label, and styling bugs fixed ([b2a94fa](https://bitbucket.org/enturas/design-system/commits/b2a94fa0c183bf81d9b0e59a9ecca9abda18c411))

### Features

- adding checkbox form component ([ef3738a](https://bitbucket.org/enturas/design-system/commits/ef3738a5e25fdfe81631e87d3406a62f16487eb6))
- adding Dropdown as a form component ([4128447](https://bitbucket.org/enturas/design-system/commits/41284476813b11cec6f641558864522ad837dde4))
- adding radio button as form component ([06daf66](https://bitbucket.org/enturas/design-system/commits/06daf669712c49c3c65aa3f4430e3fe01c35a3bc))
- **Fieldset:** add new component Fieldset ([9085f9e](https://bitbucket.org/enturas/design-system/commits/9085f9e2d7bb06a5cb96dc67901793161cd18267))
- **RadioGroup:** adding RadioGroup for use with radio-buttons ([7133c2e](https://bitbucket.org/enturas/design-system/commits/7133c2eb7f04e14b0d012481d7d4f334a57a42e7))

# [0.3.0](https://bitbucket.org/enturas/design-system/compare/@entur/form@0.2.0...@entur/form@0.3.0) (2019-10-22)

### Features

- **small typography:** added Small typography and documentation ([f2c6a0a](https://bitbucket.org/enturas/design-system/commits/f2c6a0a108b177efad32ca0fec0733a2072bd9d1))
- **textarea:** adding TextArea Component, including rewrite of TextField component ([37360bc](https://bitbucket.org/enturas/design-system/commits/37360bcec5d0eba27dc6dc597aad4fe84fce6979))

# 0.2.0 (2019-10-11)

### Features

- **form:** formGroup component for input components ([844612f](https://bitbucket.org/enturas/design-system/commits/844612f))
