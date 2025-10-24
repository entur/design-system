import { defineField, defineType } from 'sanity';

export const playgroundProp = defineType({
  name: 'playgroundProp',
  title: 'Playground-prop',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Prop-navn',
      type: 'string',
      description: 'Navnet på propen (f.eks. "variant", "size", "disabled")',
      validation: Rule => Rule.required().error('Prop-navn er påkrevd'),
    }),
    defineField({
      name: 'type',
      title: 'Prop-type',
      type: 'string',
      options: {
        list: [
          { title: 'String', value: 'string' },
          { title: 'Boolean', value: 'boolean' },
          { title: 'Segmented', value: 'segmented' },
          { title: 'Dropdown', value: 'dropdown' },
          { title: 'Icon', value: 'icon' },
          { title: 'Children', value: 'children' },
        ],
        layout: 'radio',
      },
      initialValue: 'string',
      validation: Rule => Rule.required().error('Prop-type er påkrevd'),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Visningsnavn for propen (valgfritt)',
    }),
    defineField({
      name: 'defaultValue',
      title: 'Standardverdi',
      type: 'string',
      description: 'Standardverdi for prop-en',
      validation: Rule =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.type === 'boolean') {
            if (['true', 'false'].includes(value || '')) return true;
            return "Standardverdi må være 'true' eller 'false'";
          }
          return true;
        }),
    }),
    defineField({
      name: 'options',
      title: 'Valg',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tilgjengelige valg for dropdown/segmented/icon props',
      hidden: ({ parent }) =>
        !['dropdown', 'segmented', 'icon'].includes(parent?.type || ''),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      type: 'type',
      label: 'label',
    },
    prepare({ name, type, label }) {
      return {
        title: label || name,
        subtitle: `${type}-prop`,
      };
    },
  },
});
