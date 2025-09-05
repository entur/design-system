import {defineField, defineType} from 'sanity'

export const copyableText = defineType({
  name: 'copyableText',
  title: 'Kopierbar tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Tekst',
      type: 'text',
      rows: 3,
      description: 'Teksten som skal være kopierbar',
      validation: (Rule) => Rule.required().error('Tekst er et påkrevd felt'),
    }),
    defineField({
      name: 'successMessage',
      title: 'Suksessmelding',
      type: 'string',
      description: 'Melding som vises når teksten kopieres (valgfritt)',
      initialValue: 'Teksten ble kopiert til utklippstavla.',
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({text}) {
      const displayText = text?.substring(0, 50) || 'Ingen tekst'
      return {
        subtitle: `${displayText}${text?.length > 50 ? '...' : ''}`,
      }
    },
  },
})
