import { defineField, defineType } from 'sanity';

export const plainCode = defineType({
  name: 'plainCode',
  title: 'Kode',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Innhold',
      type: 'text',
      rows: 6,
      description: 'Kode som skal vises (JSX, CSS, etc.)',
    }),
    defineField({
      name: 'language',
      title: 'Kodespråk',
      type: 'string',
      description:
        'Skriv inn kodespråket (f.eks. jsx, css, javascript, typescript, html, json, yaml, bash, etc.)',
      initialValue: 'jsx',
    }),
  ],
  preview: {
    select: {
      code: 'code',
      language: 'language',
    },
    prepare({ code, language }) {
      const snippet = code || 'Ingen kode';
      return {
        title: `Kode (${language || 'ukjent'})`,
        subtitle: snippet.substring(0, 50) + (snippet.length > 50 ? '...' : ''),
      };
    },
  },
});
