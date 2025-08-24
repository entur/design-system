import {defineField, defineType} from 'sanity'

export const componentTokensTable = defineType({
  name: 'componentTokensTable',
  title: 'Komponent tokens tabell',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Overskrift for tokens tabellen (valgfritt)',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      description: 'Forklaring av hva tokens tabellen viser (valgfritt)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Komponent tokens tabell',
        subtitle: 'Viser CSS custom properties for komponenten',
      }
    },
  },
})
