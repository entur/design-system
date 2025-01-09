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
    defaultValue: 'Oppdatert',
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
    options: ['bullet', 'notification', 'status'],
    defaultValue: 'status',
    type: 'dropdown',
  },
];
