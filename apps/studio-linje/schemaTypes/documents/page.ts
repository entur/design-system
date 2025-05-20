import {defineArrayMember, defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required().error('Tittel er et påkrevd felt'),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Hovedkategori',
      type: 'string',
      validation: (Rule) => Rule.required().error('Tittel er et påkrevd felt'),
    }),
    defineField({
      name: 'subcategory',
      title: 'Underkategori',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description:
        'Brukes for å lage hva urlen til siden blir. F.eks. /om-oss. Kan genereres fra tittel på bokmål.',
      validation: (Rule) => Rule.required().error('Slug er et påkrevd felt'),
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'array',
      of: [defineArrayMember({type: 'imageAndText'}), defineArrayMember({type: 'textBlocks'})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Ingen tittel',
      }
    },
  },
})
