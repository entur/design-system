import { ImageIcon } from '@entur/icons';
import { defineField, defineType } from 'sanity';

export const media = defineType({
  name: 'media',
  title: 'Media',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Bilde', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'image',
      validation: Rule => Rule.required(),
    }),

    // Image specific
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'imageDescription',
      title: 'Hva viser bildet?',
      type: 'string',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'image' || parent?.hideFromScreenreaders,
    }),
    defineField({
      name: 'hideFromScreenreaders',
      title: 'Skjul for skjermlesere',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'showDownload',
      title: 'Vis mulighet for å laste ned bildet',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'extraDownloadFiles',
      title: 'Ekstra filer for nedlasting',
      type: 'array',
      of: [{ type: 'downloadFile' }],
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'imageDisplayPreset',
      title: 'Bildeplassering-preset',
      type: 'string',
      options: {
        list: [
          { title: 'Standard', value: 'default' },
          { title: 'Full bredde', value: 'full-width-image' },
          { title: 'Logo display', value: 'contain-logo-display' },
          { title: 'Senteret bilde', value: 'centered-image' },
          { title: 'Contain full bredde', value: 'contain-full-width' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'default',
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),

    // Video specific
    defineField({
      name: 'sourceType',
      title: 'Videokilde',
      type: 'string',
      options: {
        list: [
          { title: 'Last opp video', value: 'upload' },
          { title: 'Ekstern lenke', value: 'external' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'upload',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'file',
      title: 'Videofil',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.sourceType !== 'upload',
      validation: Rule =>
        Rule.custom((val, context) => {
          const parent = (context as any)?.parent;
          if (
            parent?.mediaType === 'video' &&
            parent?.sourceType === 'upload'
          ) {
            return val ? true : 'Videofil er påkrevd når kilde er opplasting';
          }
          return true;
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'Ekstern videolenke',
      type: 'url',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.sourceType !== 'external',
      validation: Rule =>
        Rule.uri({ scheme: ['http', 'https'] }).custom((url, context) => {
          const parent = (context as any)?.parent;
          if (
            parent?.mediaType === 'video' &&
            parent?.sourceType === 'external'
          ) {
            return url ? true : 'URL er påkrevd når kilde er ekstern';
          }
          return true;
        }),
    }),
    defineField({
      name: 'poster',
      title: 'Forhåndsvisningsbilde (placeholder)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'alt',
      title: 'Hva viser videoen?',
      type: 'string',
      description: 'Brukes for tilgjengelighet (skjermlesere)',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'caption',
      title: 'Bildetekst',
      type: 'string',
      description: 'Tekst som vises under bildet eller videoen',
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'image',
      poster: 'poster',
      title: 'title',
    },
    prepare({ mediaType, image, poster, title }) {
      const isImage = mediaType === 'image';
      return {
        title: title || (isImage ? 'Bilde' : 'Video'),
        media: isImage ? image : poster || undefined,
      };
    },
  },
});
