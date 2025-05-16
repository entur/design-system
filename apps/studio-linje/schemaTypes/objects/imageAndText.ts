import {AdditionalIcon} from '@entur/icons'
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
      name: 'text',
      title: 'Tekst',
      type: 'textBlocks',
    }),
  ],
  preview: {
    select: {
      order: 'order',
      text: 'text.nb',
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
