import {defineField, defineType} from 'sanity'
import * as icons from '@entur/icons'

export const inlineIcon = defineType({
  name: 'inlineIcon',
  type: 'object',
  fields: [
    defineField({
      name: 'iconName',
      type: 'string',
      options: {
        list: Object.keys(icons).map((icon) => ({
          title: icon,
          value: icon,
        })),
      },
    }),
  ],
  preview: {
    select: {
      iconName: 'iconName',
    },
    prepare({iconName}) {
      return {
        title: iconName ?? 'No icon',
      }
    },
  },
})
