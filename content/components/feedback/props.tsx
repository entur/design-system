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
    options: ['info', 'success', 'warning', 'error'],
    defaultValue: 'info',
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
    defaultValue: '1',
    type: 'string',
    label: 'Innhold',
  },
  {
    name: 'variant',
    options: ['primary', 'success', 'warning', 'danger', 'info', 'neutral'],
    defaultValue: 'primary',
    type: 'dropdown',
  },
];
