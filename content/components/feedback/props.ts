export const bannerAlerts = [
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
    options: ['success', 'info', 'warning', 'error'],
    defaultValue: 'info',
    type: 'dropdown',
  },
  {
    name: 'closable',
    defaultValue: false,
    type: 'boolean',
  },
];
