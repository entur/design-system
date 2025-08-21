import {defineField, defineType} from 'sanity'

export const relatedComponent = defineType({
  name: 'relatedComponent',
  title: 'Relatert komponent',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required().error('Tittel er et påkrevd felt'),
    }),
    defineField({
      name: 'link',
      title: 'Lenke',
      type: 'url',
      validation: (Rule) => Rule.required().error('Lenke er et påkrevd felt'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      link: 'link',
    },
    prepare({title, link}) {
      return {
        title: title || 'Ingen tittel',
        subtitle: link || 'Ingen lenke',
      }
    },
  },
})
