import { SourceCodeIcon } from '@entur/icons';
import { defineField, defineType } from 'sanity';

export const codeExample = defineType({
  name: 'codeExample',
  title: 'Kodeeksempel',
  icon: SourceCodeIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'codeDisplayType',
      title: 'Kodevisning',
      type: 'string',
      options: {
        list: [
          { title: 'Playground (interaktiv demo)', value: 'playground' },
          { title: 'Kun kode (statisk visning)', value: 'plain' },
          { title: 'Kopiérbar tekst', value: 'copyable' },
        ],
        layout: 'radio',
      },
      initialValue: 'playground',
      validation: Rule =>
        Rule.required().error('Kodevisning er et påkrevd felt'),
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Overskrift for kodeeksempelet.',
      hidden: ({ parent }) => parent?.codeDisplayType === 'copyable',
    }),
    defineField({
      name: 'playgroundCode',
      title: 'Playground‑kode',
      type: 'playgroundCode',
      hidden: ({ parent }) => parent?.codeDisplayType !== 'playground',
    }),

    defineField({
      name: 'plainCode',
      title: 'Kode',
      type: 'plainCode',
      hidden: ({ parent }) => parent?.codeDisplayType !== 'plain',
    }),
    defineField({
      name: 'copyableText',
      title: 'Kopierbar tekst',
      type: 'copyableText',
      description: 'Tekstinnhold som kan kopieres direkte',
      hidden: ({ parent }) => parent?.codeDisplayType !== 'copyable',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      codeDisplayType: 'codeDisplayType',
      playgroundCode: 'playgroundCode.code',
      plainCode: 'plainCode.code',
      copyableText: 'copyableText.text',
    },
    prepare({
      title,
      codeDisplayType,
      playgroundCode,
      plainCode,
      copyableText,
    }) {
      const displayType =
        codeDisplayType === 'playground'
          ? 'Playground'
          : codeDisplayType === 'copyable'
          ? 'Kopiérbar tekst'
          : 'Kode';

      const rawContent =
        codeDisplayType === 'playground'
          ? playgroundCode
          : codeDisplayType === 'plain'
          ? plainCode
          : copyableText;

      const fallbackContent =
        codeDisplayType === 'copyable' ? 'Ingen tekst' : 'Ingen kode';

      const content = rawContent || fallbackContent;
      return {
        title: title || `${displayType}-eksempel`,
        subtitle: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      };
    },
  },
});
