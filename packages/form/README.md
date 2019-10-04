# Form

This package contains all the common form-components

> 💡 Looking for the [documentation](https://entur-design-system.firebaseapp.com/komponenter/input/formgroup)?

## Installation

```sh
npm install @entur/form
# or if you are using Yarn:
yarn add @entur/form
```

## Usage

```js
<TextField />

// Or with a FormGroup component wrapping it, giving it additional labels

<FormGroup
  title="Togdestinasjon"
  alertLabel="Gratulerer"
  alertLevel="success"
>
  <TextField placeholder="Oslo" />
</FormGroup>
```

Please refer to the [documentation](https://entur-design-system.firebaseapp.com/komponenter/input/formgroup) for further usage information.
