export const banner = [
  {
    name: 'title',
    defaultValue: 'Buss for trikk',
    type: 'string',
    label: 'Tittel',
  },
  {
    name: 'children',
    defaultValue: 'Gjelder mellom Holbergsplass og Jernbanetorget.',
    type: 'string',
    label: 'Innhold',
  },

  {
    name: 'variant',
    options: ['information', 'success', 'warning', 'negative'],
    defaultValue: 'information',
    type: 'dropdown',
  },
  {
    name: 'closable',
    defaultValue: false,
    type: 'boolean',
  },
];

export const badgeprops = [
  {
    name: 'children',
    defaultValue: '9+',
    type: 'string',
    label: 'Innhold',
  },
  {
    name: 'variant',
    options: [
      'primary',
      'success',
      'warning',
      'negative',
      'information',
      'neutral',
    ],
    defaultValue: 'primary',
    type: 'dropdown',
  },
  {
    name: 'type',
    options: ['bullet', 'notification'],
    defaultValue: 'notification',
    type: 'dropdown',
  },
];
