import * as icons from '@entur/icons';
import { defineField, defineType } from 'sanity';
import { TitleSuggestionsInput } from '../../components/TitleSuggestionsInput';
import { isEnturIcon } from '../../utils';
import { ALL_SECTION_TITLES } from '../../titleSuggestions';

export const docSectionType = defineType({
  name: 'docSection',
  title: 'Seksjon',
  type: 'object',
  icon: icons.RowHeightMiddleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description:
        'Valgfri seksjonstittel. Velg fra standardtitlene eller skriv en egendefinert.',
      components: {
        input: TitleSuggestionsInput({
          suggestions: ALL_SECTION_TITLES,
        }),
      },
    }),
    defineField({
      name: 'items',
      title: 'Innhold',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
          ],
          lists: [
            { title: 'Punktliste', value: 'bullet' },
            { title: 'Nummerert', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
          },
          of: [
            {
              name: 'inlineIcon',
              type: 'inlineIcon',
              components: {
                inlineBlock: props => {
                  return props.renderDefault({
                    ...props,
                    renderPreview: ({
                      value,
                    }: {
                      value: { iconName: string };
                    }) => {
                      if (
                        value.iconName === undefined ||
                        !isEnturIcon(value.iconName)
                      )
                        return 'Velg ikon';
                      const Icon = icons[value.iconName];
                      return <Icon style={{ marginInline: '0.1rem' }} inline />;
                    },
                  });
                },
              },
            },
          ],
        },
        { type: 'media' },
        { type: 'textBlocks' },
        { type: 'link' },
        { type: 'group' },
        { type: 'guideline' },
        { type: 'codeExample' },
        { type: 'propsTable' },
        { type: 'imageAndText' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare: ({ title, items }) => {
      const count = items?.length ?? 0;
      return {
        title: title || 'Uten tittel',
        subtitle: `${count} element${count === 1 ? '' : 'er'}`,
        media: icons.RowHeightMiddleIcon,
      };
    },
  },
});
