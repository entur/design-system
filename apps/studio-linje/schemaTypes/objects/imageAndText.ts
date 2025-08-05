import {AdditionalIcon, RowHeightMiddleIcon} from '@entur/icons'
import {defineField, defineType} from 'sanity'

export const imageAndText = defineType({
  name: 'imageAndText',
  title: 'Bilde og tekst',
  type: 'object',
  icon: AdditionalIcon,
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Fremhevet', value: 'contrast'},
          {title: 'Retningslinje-kort', value: 'guideline'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'standard',
    }),
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
      hidden: ({parent}) => parent?.variant === 'guideline',
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
      name: 'showDownload',
      title: 'Vis mulighet for å laste ned bildet',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.variant === 'guideline',
    }),
    defineField({
      name: 'guidelineTitle',
      title: 'Tittel',
      type: 'string',
      hidden: ({parent}) => parent?.variant !== 'guideline',
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
    defineField({
      name: 'guidelineVariant',
      title: 'Retningslinje-variant',
      type: 'string',
      options: {
        list: [
          {title: 'Suksess (Do)', value: 'success'},
          {title: 'Informasjon', value: 'information'},
          {title: 'Advarsel', value: 'warning'},
          {title: 'Feil (Dont)', value: 'negative'},
          {title: 'Ingen ikon', value: 'none'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'success',
      hidden: ({parent}) => parent?.variant !== 'guideline',
    }),
    defineField({
      name: 'imageDisplayPreset',
      title: 'Bildeplassering-preset',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'default'},
          {title: 'Full bredde', value: 'full-width-image'},
          {title: 'Logo display', value: 'contain-logo-display'},
          {title: 'Senteret bilde', value: 'centered-image'},
          {title: 'Contain full bredde', value: 'contain-full-width'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'default',
      hidden: ({parent}) => parent?.variant === 'guideline',
    }),
    defineField({
      name: 'noPadding',
      title: 'Ingen padding på bildet',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.variant !== 'guideline',
    }),
    defineField({
      name: 'textInBox',
      title: 'Tekst i bilde-boks',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.variant !== 'guideline',
    }),
  ],
  preview: {
    select: {
      variant: 'variant',
      dodontVariant: 'dodontVariant',
      order: 'order',
      text: 'text',
      image: 'image',
    },
    prepare({variant, dodontVariant, order, text, image}) {
      if (variant === 'dodont') {
        return {
          title: `Do/Dont kort (${dodontVariant || 'success'})`,
          media: image,
        }
      }
      return {
        title:
          order === 'image-first' ? 'Tekst og bilde (bilde først)' : 'Bilde og tekst (tekst først)',
        media: image,
      }
    },
  },
})
