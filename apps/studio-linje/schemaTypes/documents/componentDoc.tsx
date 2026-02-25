import React from 'react';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { AutocompletePageFieldInput } from '../../components/AutocompletePageFieldInput';

import { StringInputProps } from 'sanity';

const DynamicCategoryInput = (props: StringInputProps) => {
  return <AutocompletePageFieldInput {...props} fieldType="category" />;
};

const DynamicSubcategoryInput = (props: StringInputProps) => {
  return <AutocompletePageFieldInput {...props} fieldType="subcategory" />;
};

export const componentDoc = defineType({
  name: 'componentDoc',
  title: 'Komponent',
  type: 'document',
  fieldsets: [
    {
      name: 'legacyTabs',
      title: 'Legacy faner',
      options: { collapsible: true, collapsed: true },
    },
  ],
  orderings: [
    {
      title: 'Category, Subcategory, Title',
      name: 'categorySubcategoryTitle',
      by: [
        { field: 'category', direction: 'asc' },
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
      name: 'category',
      title: 'Hovedkategori',
      type: 'string',
      components: {
        input: DynamicCategoryInput,
      },
      validation: Rule =>
        Rule.required().error('Hovedkategori er et påkrevd felt'),
    }),
    defineField({
      name: 'subcategory',
      title: 'Underkategori',
      type: 'string',
      components: {
        input: DynamicSubcategoryInput,
      },
    }),
    defineField({
      name: 'npmPackage',
      title: 'NPM‑pakke',
      type: 'string',
      description: 'Navn på NPM‑pakken, f.eks. @entur/button.',
    }),
    defineField({
      name: 'figmaLink',
      title: 'Figma‑lenke',
      type: 'url',
    }),
    defineField({
      name: 'isCategoryLandingPage',
      title: 'Er kategorilandingsside',
      type: 'boolean',
      initialValue: false,
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'isBeta',
      title: 'Beta',
      type: 'boolean',
      description: 'Markerer komponentdokumentasjonen som beta.',
      initialValue: false,
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'textBlocks',
      description: 'Valgfritt innhold som vises over fanene.',
    }),
    defineField({
      name: 'tabs',
      title: 'Faner',
      type: 'array',
      of: [defineArrayMember({ type: 'componentDocTab' })],
      description:
        'Faner som vises i komponentdokumentasjonen. Legg til én eller flere faner.',
    }),
    defineField({
      name: 'beskrivelse',
      title: 'Beskrivelse',
      type: 'textBlocks',
      description:
        'Innhold som vises i Beskrivelse-tabben (følg vår dokumentasjonsmal for standardisering av innholdet)',
      deprecated: {
        reason:
          'Bruk «Faner» i stedet. Dette feltet vil bli fjernet etter migrering.',
      },
      hidden: ({ value }) => value === undefined,
      fieldset: 'legacyTabs',
      initialValue: undefined,
    }),
    defineField({
      name: 'utvikling',
      title: 'Utvikling',
      type: 'textBlocks',
      description:
        'Innhold som vises i Utvikling-tabben (følg vår dokumentasjonsmal for standardisering av innholdet)',
      deprecated: {
        reason:
          'Bruk «Faner» i stedet. Dette feltet vil bli fjernet etter migrering.',
      },
      hidden: ({ value }) => value === undefined,
      fieldset: 'legacyTabs',
      initialValue: undefined,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      subcategory: 'subcategory',
    },
    prepare({ title, category, subcategory }) {
      return {
        title: title || 'Ingen tittel',
        subtitle: subcategory ? `${category} > ${subcategory}` : category,
      };
    },
  },
});
