import { defineField, defineType } from 'sanity';
import CodeInput from '../../components/CodeInput';

export const playgroundCode = defineType({
  name: 'playgroundCode',
  title: 'Playground-kode',
  type: 'object',
  fieldsets: [
    {
      name: 'options',
      title: 'Valg',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'code',
      title: 'Kode',
      type: 'text',
      description: 'Kode som vises i demoen (JSX)',
      components: { input: CodeInput },
      options: { language: 'jsx' } as any,
    }),
    defineField({
      name: 'componentName',
      title: 'Komponentnavn',
      type: 'string',
      description: 'Komponentnavn for playground (f.eks. Button, ButtonGroup)',
    }),
    defineField({
      name: 'props',
      title: 'Props',
      type: 'array',
      of: [{ type: 'playgroundProp' }],
      description: 'Konfigurer props som skal være tilgjengelige i playground',
    }),
    defineField({
      name: 'playgroundProps',
      title: 'Legacy Playground‑props',
      type: 'string',
      description:
        'Legacy: Velg hvilke props som skal være tilgjengelige i playground (valgfritt)',
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
      initialValue: '',
      hidden: ({ parent }) => parent?.props && parent.props.length > 0,
    }),
    defineField({
      name: 'hideCode',
      title: 'Skjul kode',
      type: 'boolean',
      description: 'Skjuler kodevisningen i playground.',
      initialValue: false,
      fieldset: 'options',
    }),
    defineField({
      name: 'scaledPreview',
      title: 'Vis som sidemal',
      type: 'boolean',
      description:
        'Vis forhåndsvisningen som en nedskalert 16:9-skjerm. Nyttig for full-sides maler som Portal B2B.',
      initialValue: false,
      fieldset: 'options',
    }),
    defineField({
      name: 'containerStyle',
      title: 'CSS for forhåndsvisning',
      type: 'array',
      description:
        'CSS-stil som settes på forhåndsvisningsbeholderen (Playground).',
      of: [{ type: 'cssProperty' }],
      fieldset: 'options',
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
