import {defineField, defineType} from 'sanity'
import * as icons from '@entur/icons'
import IconInput from '../../components/IconInput'

const LINK_TYPES = [
  {title: 'Tekst', value: 'text'},
  {title: 'Kort', value: 'navigationcard'},
  {title: 'Primærknapp', value: 'button'},
  {title: 'Sekundærknapp', value: 'button-secondary'},
  {title: 'Nedlasting', value: 'download'},
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
      hidden: ({parent}) => parent?.linkType === 'download',
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
      name: 'downloadFile',
      type: 'file',
      title: 'Fil for nedlasting',
      description: 'Velg en fil som skal lastes ned',
      hidden: ({parent}) => parent?.linkType !== 'download',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif,.svg',
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
      linkType: 'linkType',
      downloadFile: 'downloadFile',
    },
    prepare({linkText, linkType, downloadFile}) {
      if (linkType === 'download' && downloadFile) {
        return {
          title: linkText
            ? `Nedlasting: ${linkText}`
            : `Nedlasting: ${downloadFile.asset?.originalFilename || 'Fil'}`,
        }
      }
      return {
        title: linkText ? 'Link til: ' + linkText : 'Link',
      }
    },
  },
})
