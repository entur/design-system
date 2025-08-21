import React from 'react'
import {defineField, defineType} from 'sanity'
import {AutocompletePageFieldInput} from '../../components/AutocompletePageFieldInput'

import {StringInputProps} from 'sanity'

const DynamicCategoryInput = (props: StringInputProps) => {
  return <AutocompletePageFieldInput {...props} fieldType="category" />
}

const DynamicSubcategoryInput = (props: StringInputProps) => {
  return <AutocompletePageFieldInput {...props} fieldType="subcategory" />
}

export const componentDoc = defineType({
  name: 'componentDoc',
  title: 'Komponentdokumentasjon',
  type: 'document',
  orderings: [
    {
      title: 'Category, Subcategory, Title',
      name: 'categorySubcategoryTitle',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'subcategory', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required().error('Tittel er et påkrevd felt'),
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
      validation: (Rule) => Rule.required().error('Hovedkategori er et påkrevd felt'),
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
      description: 'Navn på NPM‑pakken, f.eks. @entur/button',
    }),
    defineField({
      name: 'figmaLink',
      title: 'Figma‑lenke',
      type: 'url',
    }),
    defineField({
      name: 'componentName',
      title: 'Komponentnavn',
      type: 'string',
      description: 'Eksakt React komponentnavn som Props‑tab skal vise (f.eks. Button)',
      validation: (Rule) => Rule.required().error('Komponentnavn er et påkrevd felt'),
    }),
    defineField({
      name: 'beskrivelse',
      title: 'Beskrivelse',
      type: 'textBlocks',
      description: 'Innhold som vises i Beskrivelse-tabben (inkludert DoDonts og kodeeksempler)',
    }),
    defineField({
      name: 'utvikling',
      title: 'Utvikling',
      type: 'textBlocks',
      description:
        'Innhold som vises i Utvikling-tabben (teknisk informasjon, implementasjon, etc.)',
    }),
    defineField({
      name: 'relatedComponents',
      title: 'Relaterte komponenter',
      type: 'array',
      of: [{type: 'relatedComponent'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      subcategory: 'subcategory',
    },
    prepare({title, category, subcategory}) {
      return {
        title: title || 'Ingen tittel',
        subtitle: subcategory ? `${category} > ${subcategory}` : category,
      }
    },
  },
})
