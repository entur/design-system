import * as icons from '@entur/icons'
import {defineField, defineType} from 'sanity'
import {isEnturIcon} from '../../utils'

export const VARIANT_TYPES = [
  {title: 'Standard', value: 'normal'},
  {title: 'Informasjon', value: 'information'},
  {title: 'Fremhevet', value: 'contrast'},
]

export const textBlocksType = defineType({
  name: 'textBlocks',
  title: 'Tekstboks',
  type: 'object',
  icon: icons.RowHeightMiddleIcon,
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: VARIANT_TYPES,
        layout: 'dropdown',
      },
      initialValue: 'normal',
      hidden: ({parent}) => parent !== undefined && !('_key' in parent),
    }),
    defineField({
      name: 'items',
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
            {title: 'H5', value: 'h5'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
          },
          of: [
            {
              name: 'inlineIcon',
              type: 'inlineIcon',
              components: {
                inlineBlock: (props) => {
                  return props.renderDefault({
                    ...props,
                    renderPreview: ({value}: {value: {iconName: string}}) => {
                      if (value.iconName === undefined || !isEnturIcon(value.iconName))
                        return 'Velg ikon'

                      const Icon = icons[value.iconName]
                      return <Icon style={{marginInline: '0.1rem'}} inline />
                    },
                  })
                },
              },
            },
          ],
        },
        {type: 'imageAndText'},
        {type: 'textBlocks'},
        {type: 'link'},
        {type: 'group'},
      ],
    }),
  ],
  preview: {
    select: {
      textBlocks: 'items',
    },
    prepare: ({textBlocks}) => ({
      title: textBlocks
        ? `${textBlocks.length} tekstblokk${textBlocks.length === 1 ? '' : 'er'}`
        : 'empty',
    }),
  },
})
