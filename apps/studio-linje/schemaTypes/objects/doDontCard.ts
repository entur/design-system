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
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Åpne i ny fane',
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'Rikt innhold for kortet (støtter lister, overskrifter, lenker, etc.)',
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

      // Extract text from rich content array
      const contentText = content?.[0]?.children?.[0]?.text || 'Ingen innhold'
      const truncatedText =
        contentText.length > 50 ? `${contentText.substring(0, 50)}...` : contentText

      return {
        title: title || 'Do/Dont kort',
        subtitle: `${variantLabels[variant as keyof typeof variantLabels]} - ${truncatedText}`,
      }
    },
  },
})
