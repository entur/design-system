export const standardknapper = [
  {
    name: 'width',
    defaultValue: 'auto',
    options: ['auto', 'fluid'],
    type: 'segmented',
  },
  {
    name: 'children',
    defaultValue: 'Publiser',
    type: 'string',
    label: 'Button text',
  },
  {
    name: 'variant',
    options: ['primary', 'secondary', 'success', 'negative', 'tertiary'],
    defaultValue: 'primary',
    type: 'dropdown',
  },
  {
    name: 'size',
    options: ['medium', 'large'],
    defaultValue: 'medium',
    type: 'dropdown',
  },
  {
    name: 'disabled',
    defaultValue: false,
    type: 'boolean',
  },
  {
    name: 'loading',
    defaultValue: false,
    type: 'boolean',
  },
];

export const flytendeknapper = [
  {
    name: 'children',
    defaultValue: 'Publiser',
    type: 'string',
    label: 'Button text',
  },
  {
    name: 'size',
    options: ['small', 'medium'],
    defaultValue: 'medium',
    type: 'dropdown',
  },
];
