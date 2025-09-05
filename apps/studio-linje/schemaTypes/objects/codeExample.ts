import {defineField, defineType} from 'sanity'

export const codeExample = defineType({
  name: 'codeExample',
  title: 'Kodeeksempel',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Overskrift for kodeeksempelet.',
    }),
    defineField({
      name: 'codeDisplayType',
      title: 'Kodevisning',
      type: 'string',
      options: {
        list: [
          {title: 'Playground (interaktiv demo)', value: 'playground'},
          {title: 'Kun kode (statisk visning)', value: 'plain'},
        ],
        layout: 'radio',
      },
      initialValue: 'playground',
      validation: (Rule) => Rule.required().error('Kodevisning er et påkrevd felt'),
    }),
    defineField({
      name: 'playgroundCode',
      title: 'Playground‑kode',
      type: 'text',
      rows: 4,
      description: 'Kode som vises i demoen (JSX)',
      hidden: ({parent}) => parent?.codeDisplayType !== 'playground',
    }),
    defineField({
      name: 'playgroundProps',
      title: 'Playground‑props',
      type: 'string',
      description: 'Velg hvilke props som skal være tilgjengelige i playground (valgfritt)',
      options: {
        list: [
          {title: 'Ingen props (kun kode)', value: ''},
          {title: 'Standard knapper', value: 'standardknapper'},
          {title: 'Flytende knapper', value: 'flytendeknapper'},
          {title: 'Banner', value: 'banner'},
          {title: 'Badge props', value: 'badgeprops'},
          {title: 'Cards', value: 'cards'},
          {title: 'Top navigation', value: 'topnavigation'},
          {title: 'Text field', value: 'textfield'},
          {title: 'Text area', value: 'textarea'},
          {title: 'Input panel', value: 'inputpanel'},
          {title: 'Travel tag', value: 'traveltag'},
          {title: 'Travel switch', value: 'travelswitch'},
          {title: 'Travel leg', value: 'travelleg'},
          {title: 'Travel header', value: 'travelheader'},
        ],
      },
      hidden: ({parent}) => parent?.codeDisplayType !== 'playground',
    }),
    defineField({
      name: 'plainCode',
      title: 'Kode',
      type: 'text',
      rows: 6,
      description: 'Kode som skal vises (JSX, CSS, etc.)',
      hidden: ({parent}) => parent?.codeDisplayType !== 'plain',
    }),
    defineField({
      name: 'codeLanguage',
      title: 'Kodespråk',
      type: 'string',
      description:
        'Skriv inn kodespråket (f.eks. jsx, css, javascript, typescript, html, json, yaml, bash, etc.)',
      initialValue: 'jsx',
      hidden: ({parent}) => parent?.codeDisplayType !== 'plain',
    }),
    defineField({
      name: 'componentName',
      title: 'Komponentnavn',
      type: 'string',
      description: 'Komponentnavn for playground (f.eks. Button, ButtonGroup)',
      hidden: ({parent}) => parent?.codeDisplayType !== 'playground',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      codeDisplayType: 'codeDisplayType',
      playgroundCode: 'playgroundCode',
      plainCode: 'plainCode',
    },
    prepare({title, codeDisplayType, playgroundCode, plainCode}) {
      const code = playgroundCode || plainCode || 'Ingen kode'
      const displayType = codeDisplayType === 'playground' ? 'Playground' : 'Kode'
      return {
        title: title || `${displayType} eksempel`,
        subtitle: code.substring(0, 50) + (code.length > 50 ? '...' : ''),
      }
    },
  },
})
