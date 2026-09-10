import { RowHeightMiddleIcon } from '@entur/icons';
import { defineField, defineType } from 'sanity';
import { TitleSuggestionsInput } from '../../components/TitleSuggestionsInput';
import { TAB_TITLES } from '../../titleSuggestions';

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
      description:
        'Velg en av standardtitlene (Oversikt, Kode, Tilgjengelighet) eller skriv en egendefinert tittel.',
      components: {
        input: TitleSuggestionsInput({ suggestions: TAB_TITLES }),
      },
      validation: Rule => Rule.required().error('Tittel er et påkrevd felt'),
    }),
    defineField({
      name: 'sections',
      title: 'Seksjoner',
      type: 'array',
      of: [{ type: 'docSection' }],
      description:
        'Legg til seksjoner for denne fanen. Bruk standardtitler der det passer — egendefinerte titler er mulig, men standardtitler gir konsistent struktur på tvers av komponenter.',
      validation: Rule =>
        Rule.custom((sections, context) => {
          const parent = context.parent as { content?: unknown } | undefined;
          const hasContent = parent?.content !== undefined;
          const hasSections = Array.isArray(sections) && sections.length > 0;
          if (!hasSections && !hasContent) {
            return 'Fanen må ha minst én seksjon.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'content',
      title: 'Innhold (utgått)',
      type: 'textBlocks',
      deprecated: {
        reason:
          'Bruk «Seksjoner» i stedet. Dette feltet vil bli fjernet etter at alle dokumenter er migrert.',
      },
      hidden: ({ value }) => value === undefined,
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
