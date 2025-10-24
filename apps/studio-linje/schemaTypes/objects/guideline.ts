import { NewIcon } from '@entur/icons';
import { defineField, defineType } from 'sanity';

export const guideline = defineType({
  name: 'guideline',
  title: 'Retningslinje',
  type: 'object',
  icon: NewIcon,
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Suksess (Do)', value: 'success' },
          { title: 'Informasjon', value: 'information' },
          { title: 'Advarsel', value: 'warning' },
          { title: 'Feil (Dont)', value: 'negative' },
          { title: 'Ingen ikon', value: 'none' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'success',
      validation: Rule => Rule.required().error('Variant er et påkrevd felt'),
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Overskrift for retningslinjen',
    }),
    defineField({
      name: 'text',
      title: 'Innhold',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Åpne i ny fane',
                  },
                ],
              },
            ],
          },
        },
      ],
      description:
        'Rikt innhold for retningslinjen (støtter lister, overskrifter, lenker, etc.)',
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      description: 'Bilde som vises i retningslinjen (valgfritt)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'alt',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Beskrivende tekst for bildet (for tilgjengelighet)',
      hidden: ({ parent }) => !parent?.image,
    }),
    defineField({
      name: 'hideFromScreenreaders',
      title: 'Skjul for skjermlesere',
      type: 'boolean',
      initialValue: false,
      description: 'Skjul bildet fra skjermlesere',
    }),
    defineField({
      name: 'noPadding',
      title: 'Ingen padding på bildet',
      type: 'boolean',
      description: 'Fjern padding rundt bildet',
      initialValue: false,
    }),
    defineField({
      name: 'textInBox',
      title: 'Tekst i bilde-boks',
      type: 'boolean',
      description: 'Vis tekst inni bildet i stedet for under',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      variant: 'variant',
      text: 'text',
      image: 'image',
    },
    prepare({ title, variant, text, image }) {
      const variantLabels = {
        success: 'Suksess',
        information: 'Informasjon',
        warning: 'Advarsel',
        negative: 'Feil',
        none: 'Ingen ikon',
      };

      const textContent = text?.[0]?.children?.[0]?.text || 'Ingen innhold';
      const truncatedText =
        textContent.length > 50
          ? `${textContent.substring(0, 50)}...`
          : textContent;

      return {
        title: title || 'Retningslinje',
        subtitle: `${
          variantLabels[variant as keyof typeof variantLabels]
        } - ${truncatedText}`,
        media: image,
      };
    },
  },
});
