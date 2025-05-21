import {defineField, defineType} from 'sanity'
import * as icons from '@entur/icons'

const LINK_TYPES = [
  {title: 'Tekst', value: 'text'},
  {title: 'Kort', value: 'navigationcard'},
  {title: 'Primærnapp', value: 'button'},
]

export const LinkType = defineType({
  name: 'link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkAddress',
      type: 'string',
    }),
    defineField({
      name: 'linkText',
      type: 'string',
    }),
    defineField({
      name: 'linkType',
      type: 'string',
      options: {
        list: LINK_TYPES,
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
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
      order: 'order',
      text: 'text',
      image: 'image',
    },
    prepare({linkText}) {
      return {
        title: linkText ? 'Link til: ' + linkText : 'Link',
      }
    },
  },
})
