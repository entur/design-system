import {AdditionalIcon, RowHeightMiddleIcon} from '@entur/icons'
import {defineField, defineType} from 'sanity'

export const imageAndText = defineType({
  name: 'imageAndText',
  title: 'Bilde og tekst',
  type: 'object',
  icon: AdditionalIcon,
  fields: [
    defineField({
      name: 'order',
      title: 'Rekkefølge',
      type: 'string',
      options: {
        list: [
          {title: 'Bilde først', value: 'image-first'},
          {title: 'Tekst først', value: 'text-first'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'image-first',
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
    }),
    defineField({
      name: 'imageDescription',
      title: 'Hva viser bildet?',
      type: 'string',
      hidden: ({parent}) => parent?.hideFromScreenreaders,
    }),
    defineField({
      name: 'hideFromScreenreaders',
      title: 'Skjul for skjermlesere',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'addMargin',
      title: 'Legg til luft rundt bildet',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showDownload',
      title: 'Vis mulighet for å laste ned bildet',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'text',
      title: 'Tekstelementer',
      icon: RowHeightMiddleIcon,
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'H5', value: 'h5'},
            {title: 'Code', value: 'code'},
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(3).error('At least one text block is required'),
    }),
  ],
  preview: {
    select: {
      order: 'order',
      text: 'text',
      image: 'image',
    },
    prepare({order, text, image}) {
      return {
        title:
          order === 'image-first' ? 'Tekst og bilde (bilde først)' : 'Bilde og tekst (tekst først)',
        media: image,
      }
    },
  },
})
