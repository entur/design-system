# Button

This package contains the button component

> 💡 Looking for the [documentation](https://design.entur.org/komponenter/menyer)?

## Installation

```sh
npm install @entur/menu
# or if you are using Yarn:
yarn add @entur/menu
```

## Usage

```js
<Menu>
  <MenuItem href="#menus">Menu item</MenuItem>
  <MenuItem>
    Nested menu
    <Menu>
      <MenuItem active={true} href="#">
        Nested menu item
      </MenuItem>
      <MenuItem disabled={true}>Second nested menu</MenuItem>
    </Menu>
  </MenuItem>
</Menu>
```

Please refer to the [documentation](https://design.entur.org/komponenter/menyer) for further usage information.
