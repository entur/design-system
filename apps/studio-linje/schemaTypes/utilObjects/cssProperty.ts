import { defineField, defineType } from 'sanity';

export const cssProperty = defineType({
  name: 'cssProperty',
  title: 'CSS-egenskap',
  type: 'object',
  fields: [
    defineField({
      name: 'property',
      title: 'Egenskap',
      type: 'string',
    }),
    defineField({ name: 'value', title: 'Verdi', type: 'string' }),
  ],
  preview: {
    select: { property: 'property', value: 'value' },
    prepare: ({ property, value }) => ({
      title: `${property}: ${value}`,
    }),
  },
});
