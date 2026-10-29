import React from 'react';
import { defineField, defineType } from 'sanity';
import { AutocompletePageFieldInput } from '../../components/AutocompletePageFieldInput';
import { AutocompleteTagInput } from '../../components/AutocompleteTagInput';

import { StringInputProps } from 'sanity';

const DynamicCategoryInput = (props: StringInputProps) => {
  return <AutocompletePageFieldInput {...props} fieldType="category" />;
};

const DynamicSubcategoryInput = (props: StringInputProps) => {
  return <AutocompletePageFieldInput {...props} fieldType="subcategory" />;
};

export const page = defineType({
  name: 'page',
  title: 'Artikkel',
  type: 'document',
  orderings: [
    {
      title: 'Category, Subcategory, Title',
      name: 'categorySubcategoryTitle',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'isCategoryLandingPage', direction: 'desc' },
        { field: 'subcategory', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: Rule => Rule.required().error('Tittel er et påkrevd felt'),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'string',
    }),
    defineField({
      name: 'parentPage',
      title: 'Overordnet side',
      description:
        'Gjør denne til en underside. Den får kategoriene og adressen til den overordnede siden, og vises under den i menyen.',
      type: 'reference',
      to: [{ type: 'page' }],
      options: {
        // Only one level of nesting
        filter: ({ document }) => ({
          filter: '!defined(parentPage) && _id != $id && _id != $draftId',
          params: {
            id: document._id.replace(/^drafts\./, ''),
            draftId: `drafts.${document._id.replace(/^drafts\./, '')}`,
          },
        }),
      },
    }),
    defineField({
      name: 'category',
      title: 'Hovedkategori',
      type: 'string',
      components: {
        input: DynamicCategoryInput,
      },
      hidden: ({ document }) => Boolean(document?.parentPage),
      validation: Rule =>
        Rule.custom((category, context) =>
          category || context.document?.parentPage
            ? true
            : 'Hovedkategori er et påkrevd felt',
        ),
    }),
    defineField({
      name: 'subcategory',
      title: 'Underkategori',
      type: 'string',
      components: {
        input: DynamicSubcategoryInput,
      },
      hidden: ({ document }) => Boolean(document?.parentPage),
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      components: { input: AutocompleteTagInput },
      description: 'Valgfri tag som vises på siden.',
    }),
    defineField({
      name: 'isCategoryLandingPage',
      title: 'Er kategorilandingsside',
      description:
        'Hvis aktivert vil denne siden vises når man går til denne kategorien fra hovedmenyen.',
      type: 'boolean',
      initialValue: false,
      hidden: ({ document }) => Boolean(document?.parentPage),
      validation: Rule =>
        Rule.custom(async (isCategoryLandingPage, context) => {
          if (!isCategoryLandingPage) return true;

          const { getClient } = context;
          const client = getClient({ apiVersion: '2023-05-03' });

          const categoryForCurrentDocument = context.document?.category;
          if (!categoryForCurrentDocument)
            return 'Kategori må være satt for å kunne bruke kategorilandingsside';

          // Check if there's already a category landing page for this category
          // other than the currently view document
          const currentId = context.document?._id?.replace(/^drafts\./, '');
          const existingLandingPage = await client.fetch(
            `*[_type == "page" && category == $category && isCategoryLandingPage == true && _id != $id && (!defined(_id) || (_id != $draftId))][0]`,
            {
              category: categoryForCurrentDocument,
              id: currentId,
              draftId: `drafts.${currentId}`,
            },
          );

          if (existingLandingPage) {
            return `Det finnes allerede en kategorilandingsside for "${categoryForCurrentDocument}" ved navn "${existingLandingPage.title}". Kun én landingsside per kategori er tillatt.`;
          }

          return true;
        }),
    }),
    defineField({
      name: 'content',
      title: 'Sideinnhold',
      type: 'textBlocks',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      subcategory: 'subcategory',
      isCategoryLandingPage: 'isCategoryLandingPage',
      tag: 'tag',
      parentTitle: 'parentPage.title',
    },
    prepare({
      title,
      category,
      subcategory,
      isCategoryLandingPage,
      tag,
      parentTitle,
    }) {
      const subtitle = parentTitle
        ? `Underside av ${parentTitle}`
        : isCategoryLandingPage
        ? `${category} (Landingsside)`
        : subcategory
        ? `${category} > ${subcategory}`
        : category;

      return {
        title: `${title || 'Ingen tittel'}${tag ? ` (${tag})` : ''}`,
        subtitle,
      };
    },
  },
});
