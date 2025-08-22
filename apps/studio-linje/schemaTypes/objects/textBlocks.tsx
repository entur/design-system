import * as icons from '@entur/icons'
import {defineField, defineType} from 'sanity'
import {isEnturIcon} from '../../utils'

export const VARIANT_TYPES = [
  {title: 'Standard', value: 'normal'},
  {title: 'Informasjon', value: 'information'},
  {title: 'Fremhevet', value: 'contrast'},
  {title: 'Varselmelding', value: 'alert'},
]

export const ALERT_VARIANTS = [
  {title: 'Suksess', value: 'success'},
  {title: 'Informasjon', value: 'information'},
  {title: 'Advarsel', value: 'warning'},
  {title: 'Feil', value: 'negative'},
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
      name: 'title',
      title: 'Tittel',
      type: 'string',
      hidden: ({parent}) => !['alert'].includes(parent?.variant || ''),
    }),
    defineField({
      name: 'alertType',
      title: 'Varseltype',
      type: 'string',
      options: {
        list: ALERT_VARIANTS,
        layout: 'dropdown',
      },
      initialValue: 'information',
      hidden: ({parent}) => parent?.variant !== 'alert',
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
        {type: 'codeExample'},
        {type: 'doDontGroup'},
      ],
    }),
  ],
  preview: {
    select: {
      variant: 'variant',
      alertType: 'alertType',
      title: 'title',
      items: 'items',
    },
    prepare: ({variant, alertType, title, items}) => {
      const textBlockVariantTitle = VARIANT_TYPES.find((v) => v.value === variant)?.title || variant

      const alertTypeTitle = alertType
        ? ALERT_VARIANTS.find((a) => a.value === alertType)?.title
        : null

      const textContent =
        items
          ?.map((item: any) => {
            if (item._type === 'block') {
              return item.children?.map((child: any) => child.text).join('') || ''
            }
            return item._type || ''
          })
          .join(' ') || ''

      const truncatedText =
        textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent

      const previewTitle = buildPreviewTitle({
        variant,
        textBlockVariantTitle,
        alertTypeTitle,
        title,
        truncatedText,
      })

      const itemCount = items?.length || 0
      const subtitle =
        itemCount > 0 ? `${itemCount} element${itemCount === 1 ? '' : 'er'}` : 'Ingen innhold'

      return {
        title: previewTitle,
        subtitle,
        media:
          variant === 'alert'
            ? icons.ValidationExclamationIcon
            : variant === 'information'
              ? icons.ValidationInfoIcon
              : icons.RowHeightMiddleIcon,
      }
    },
  },
})

function buildPreviewTitle({
  variant,
  textBlockVariantTitle,
  alertTypeTitle,
  title,
  truncatedText,
}: {
  variant: string
  textBlockVariantTitle: string
  alertTypeTitle: string | null | undefined
  title: string | null | undefined
  truncatedText: string
}) {
  let previewTitle = `${textBlockVariantTitle}`

  if (variant === 'alert') {
    if (title) {
      previewTitle += `: ${title}`
    } else if (alertTypeTitle) {
      previewTitle += ` (${alertTypeTitle})`
    }
  }

  if (truncatedText) {
    previewTitle += ` - ${truncatedText}`
  }

  return previewTitle
}
