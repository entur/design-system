import { RowHeightMiddleIcon } from '@entur/icons';
import { defineField, defineType } from 'sanity';

export const componentDocTab = defineType({
  name: 'componentDocTab',
  title: 'Komponentfane',
  type: 'object',
  icon: RowHeightMiddleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: Rule => Rule.required().error('Tittel er et påkrevd felt'),
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'textBlocks',
      validation: Rule => Rule.required().error('Innhold er et påkrevd felt'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare: ({ title }) => ({
      title: title || 'Uten tittel',
    }),
  },
});
