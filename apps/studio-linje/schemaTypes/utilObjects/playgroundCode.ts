import { defineField, defineType } from 'sanity';

export const playgroundCode = defineType({
  name: 'playgroundCode',
  title: 'Playground-kode',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Kode',
      type: 'text',
      rows: 4,
      description: 'Kode som vises i demoen (JSX)',
    }),
    defineField({
      name: 'playgroundProps',
      title: 'Playground‑props',
      type: 'string',
      description:
        'Velg hvilke props som skal være tilgjengelige i playground (valgfritt)',
      options: {
        list: [
          { title: 'Ingen props (kun kode)', value: '' },
          { title: 'Standard knapper', value: 'standardknapper' },
          { title: 'Flytende knapper', value: 'flytendeknapper' },
          { title: 'Banner', value: 'banner' },
          { title: 'Badge props', value: 'badgeprops' },
          { title: 'Cards', value: 'cards' },
          { title: 'Top navigation', value: 'topnavigation' },
          { title: 'Text field', value: 'textfield' },
          { title: 'Text area', value: 'textarea' },
          { title: 'Input panel', value: 'inputpanel' },
          { title: 'Travel tag', value: 'traveltag' },
          { title: 'Travel switch', value: 'travelswitch' },
          { title: 'Travel leg', value: 'travelleg' },
          { title: 'Travel header', value: 'travelheader' },
        ],
      },
    }),
    defineField({
      name: 'componentName',
      title: 'Komponentnavn',
      type: 'string',
      description: 'Komponentnavn for playground (f.eks. Button, ButtonGroup)',
    }),
  ],
  preview: {
    select: {
      code: 'code',
    },
    prepare({ code }) {
      const snippet = code || 'Ingen kode';
      return {
        title: 'Playground-kode',
        subtitle: snippet.substring(0, 50) + (snippet.length > 50 ? '...' : ''),
      };
    },
  },
});
