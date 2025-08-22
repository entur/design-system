import {defineField, defineType} from 'sanity'

export const propsTable = defineType({
  name: 'propsTable',
  title: 'Props tabell',
  type: 'object',
  fields: [
    defineField({
      name: 'componentName',
      title: 'Komponentnavn',
      type: 'string',
      description:
        'Navn på komponenten som props skal vises for (f.eks. "ActionChip, ChoiceChip, etc.")',
      validation: (Rule) => Rule.required().error('Komponentnavn er et påkrevd felt'),
    }),
  ],
  preview: {
    select: {
      componentName: 'componentName',
    },
    prepare({componentName}) {
      return {
        title: 'Props tabell',
        subtitle: componentName,
      }
    },
  },
})
