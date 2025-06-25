import {defineField, defineType} from 'sanity'
import * as icons from '@entur/icons'
import IconInput from '../../components/IconInput'

const LINK_TYPES = [
  {title: 'Tekst', value: 'text'},
  {title: 'Kort', value: 'navigationcard'},
  {title: 'Primærknapp', value: 'button'},
  {title: 'Sekundærknapp', value: 'button-secondary'},
]

export const LinkType = defineType({
  name: 'link',
  title: 'Lenke',
  icon: icons.LinkIcon,
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
      components: {
        input: IconInput,
      },
    }),
  ],
  preview: {
    select: {
      linkText: 'linkText',
    },
    prepare({linkText}) {
      return {
        title: linkText ? 'Link til: ' + linkText : 'Link',
      }
    },
  },
})
