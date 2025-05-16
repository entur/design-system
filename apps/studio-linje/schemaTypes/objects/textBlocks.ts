import {RowHeightMiddleIcon} from '@entur/icons'
import {defineField, defineType} from 'sanity'

export const textBlocks = defineType({
  name: 'textBlocks',
  title: 'Tekstseksjoner',
  type: 'object',
  icon: RowHeightMiddleIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
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
      textBlocks: 'items',
    },
    prepare: ({textBlocks}) => ({
      title: textBlocks
        ? `Tekst med ${textBlocks.length} del${textBlocks.length === 1 ? '' : 'er'}`
        : 'empty',
    }),
  },
})
