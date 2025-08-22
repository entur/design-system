import {defineField, defineType} from 'sanity'

export const doDontCard = defineType({
  name: 'doDontCard',
  title: 'Do/Dont kort',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Suksess (grønn)', value: 'success'},
          {title: 'Informasjon (blå)', value: 'information'},
          {title: 'Advarsel (gul)', value: 'warning'},
          {title: 'Feil (rød)', value: 'negative'},
          {title: 'Ingen ikon', value: 'none'},
        ],
      },
      initialValue: 'success',
      validation: (Rule) => Rule.required().error('Variant er et påkrevd felt'),
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Overskrift for kortet',
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'text',
      rows: 3,
      description: 'Tekstinnhold for kortet',
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      description: 'Bilde som vises i kortet (valgfritt)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'alt',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Beskrivende tekst for bildet (for tilgjengelighet)',
      hidden: ({parent}) => !parent?.image,
    }),
    defineField({
      name: 'noPadding',
      title: 'Ingen padding',
      type: 'boolean',
      description: 'Fjern padding rundt bildet',
      initialValue: false,
    }),
    defineField({
      name: 'textInBox',
      title: 'Tekst i boks',
      type: 'boolean',
      description: 'Vis tekst inni bildet i stedet for under',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      variant: 'variant',
      content: 'content',
    },
    prepare({title, variant, content}) {
      const variantLabels = {
        success: 'Suksess',
        information: 'Informasjon',
        warning: 'Advarsel',
        negative: 'Feil',
        none: 'Ingen ikon',
      }

      return {
        title: title || 'Do/Dont kort',
        subtitle: `${variantLabels[variant]} - ${content?.substring(0, 50) || 'Ingen innhold'}${
          content?.length > 50 ? '...' : ''
        }`,
      }
    },
  },
})
