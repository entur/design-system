import {defineField, defineType} from 'sanity'
import * as icons from '@entur/icons'
import IconInput from '../../components/IconInput'

const LINK_TYPES = [
  {title: 'Tekst', value: 'text'},
  {title: 'Kort', value: 'navigationcard'},
  {title: 'Primærknapp', value: 'button'},
  {title: 'Sekundærknapp', value: 'button-secondary'},
  {title: 'Sekundærknapp liten', value: 'button-secondary-small'},
]

const LINK_ADDRESS_TYPES = [
  {title: 'URL', value: 'url'},
  {title: 'Fil', value: 'file'},
]

export const LinkType = defineType({
  name: 'link',
  title: 'Lenke',
  icon: icons.LinkIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'linkText',
      type: 'string',
      title: 'Tekst',
      description: 'Teksten som vises til brukeren',
    }),
    defineField({
      name: 'linkType',
      title: 'Type komponent',
      type: 'string',
      options: {
        list: LINK_TYPES,
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'linkAddressType',
      type: 'string',
      title: 'Type lenkeadresse',
      description: 'Velg om lenken skal gå til en URL eller en fil',
      options: {
        list: LINK_ADDRESS_TYPES,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'url',
    }),
    defineField({
      name: 'linkAddress',
      type: 'string',
      title: 'URL',
      description: 'Nettadressen lenken skal peke til',
      hidden: ({parent}) => parent?.linkAddressType !== 'url',
    }),
    defineField({
      name: 'downloadFile',
      type: 'file',
      title: 'Fil for nedlasting',
      description: 'Velg en fil som skal lastes ned',
      hidden: ({parent}) => parent?.linkAddressType !== 'file',
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
      linkAddressType: 'linkAddressType',
      downloadFile: 'downloadFile',
    },
    prepare({linkText, linkType, linkAddressType, downloadFile}) {
      if (linkAddressType === 'file' && downloadFile) {
        return {
          title: linkText
            ? `Fil: ${linkText}`
            : `Fil: ${downloadFile.asset?.originalFilename || 'Fil'}`,
        }
      }
      return {
        title: linkText ? 'Link til: ' + linkText : 'Link',
      }
    },
  },
})
