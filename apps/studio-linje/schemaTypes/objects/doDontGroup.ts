import {defineField, defineType} from 'sanity'

export const doDontGroup = defineType({
  name: 'doDontGroup',
  title: 'Do/Dont gruppe',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel (valgfritt)',
      type: 'string',
      description: 'Overskrift for hele Do/Dont gruppen',
    }),
    defineField({
      name: 'cards',
      title: 'Do/Dont kort',
      type: 'array',
      of: [{type: 'doDontCard'}],
      validation: (Rule) => Rule.required().min(1).error('Minst ett kort er påkrevd'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      cards: 'cards',
    },
    prepare({title, cards}) {
      const cardCount = cards?.length || 0
      return {
        title: title || 'Do/Dont gruppe',
        subtitle: `${cardCount} kort`,
      }
    },
  },
})
