export const datepicker = [
  {
    name: 'label',
    defaultValue: 'Velg utreisedato',
    type: 'string',
    label: 'Label',
  },
  {
    name: 'placeholder',
    defaultValue: 'Velg en dato',
    type: 'string',
    label: 'Placeholder',
  },
  {
    name: 'variant',
    options: ['success', 'negative', 'warning', 'information'],
    defaultValue: null,
    type: 'dropdown',
  },
  {
    name: 'feedback',
    defaultValue: '',
    type: 'string',
    label: 'Feedback',
  },
];

export const inputpanel = [
  {
    name: 'size',
    defaultValue: 'medium',
    options: ['medium', 'large'],
    type: 'segmented',
  },
  {
    name: 'title',
    defaultValue: 'Standardbillett',
    type: 'string',
    label: 'Title',
  },
  {
    name: 'secondaryLabel',
    defaultValue: '99,-',
    type: 'string',
    label: 'Secondary label',
  },
  {
    name: 'children',
    defaultValue: 'Denne billetten er ikke refunderbar',
    type: 'string',
    label: 'Additional content',
  },
  {
    name: 'checked',
    defaultValue: false,
    type: 'boolean',
  },
  {
    name: 'hideCheckbox',
    defaultValue: false,
    type: 'boolean',
  },
  {
    name: 'disabled',
    defaultValue: false,
    type: 'boolean',
  },
];

export const textfield = [
  {
    name: 'size',
    defaultValue: 'medium',
    options: ['medium', 'large'],
    label: 'Størrelse',
  },
  {
    name: 'label',
    defaultValue: 'Skriv her',
    type: 'string',
    label: 'Label',
  },
  {
    name: 'labelTooltip',
    defaultValue: '',
    type: 'string',
    label: 'Tooltip',
  },
  {
    name: 'placeholder',
    defaultValue: '',
    type: 'string',
    label: 'Placeholder',
  },

  {
    name: 'prepend',
    defaultValue: '',
    type: 'string',
    label: 'Prepend',
  },
  {
    name: 'append',
    defaultValue: '',
    type: 'string',
    label: 'Append',
  },
  {
    name: 'variant',
    options: ['success', 'negative', 'warning', 'information'],
    defaultValue: null,
    type: 'dropdown',
  },
  {
    name: 'feedback',
    defaultValue: '',
    type: 'string',
    label: 'Feedback',
  },

  {
    name: 'disabled',
    defaultValue: false,
    type: 'boolean',
  },
  {
    name: 'readOnly',
    defaultValue: false,
    type: 'boolean',
  },
];

export const textarea = [
  {
    name: 'label',
    defaultValue: 'Skriv her',
    type: 'string',
    label: 'Label',
  },
  {
    name: 'labelTooltip',
    defaultValue: '',
    type: 'string',
    label: 'Tooltip',
  },
  {
    name: 'placeholder',
    defaultValue: '',
    type: 'string',
    label: 'Placeholder',
  },
  {
    name: 'variant',
    options: ['success', 'negative', 'warning', 'information'],
    defaultValue: null,
    type: 'dropdown',
  },
  {
    name: 'feedback',
    defaultValue: '',
    type: 'string',
    label: 'Feedback',
  },
  {
    name: 'disabled',
    defaultValue: false,
    type: 'boolean',
  },
  {
    name: 'readOnly',
    defaultValue: false,
    type: 'boolean',
  },
];
