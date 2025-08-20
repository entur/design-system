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

export const page = defineType({
  name: 'page',
  title: 'Dokumentasjonsside',
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
      name: 'isCategoryLandingPage',
      title: 'Er kategorilandingsside',
      description:
        'Hvis aktivert vil denne siden vises når man går til denne kategorien fra hovedmenyen.',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (isCategoryLandingPage, context) => {
          if (!isCategoryLandingPage) return true

          const {getClient} = context
          const client = getClient({apiVersion: '2023-05-03'})

          const categoryForCurrentDocument = context.document?.category
          if (!categoryForCurrentDocument)
            return 'Kategori må være satt for å kunne bruke kategorilandingsside'

          // Check if there's already a category landing page for this category
          // other than the currently view document
          const currentId = context.document?._id?.replace(/^drafts\./, '')
          const existingLandingPage = await client.fetch(
            `*[_type == "page" && category == $category && isCategoryLandingPage == true && _id != $id && (!defined(_id) || (_id != $draftId))][0]`,
            {
              category: categoryForCurrentDocument,
              id: currentId,
              draftId: `drafts.${currentId}`,
            }
          )

          if (existingLandingPage) {
            return `Det finnes allerede en kategorilandingsside for "${categoryForCurrentDocument}" ved navn "${existingLandingPage.title}". Kun én landingsside per kategori er tillatt.`
          }

          return true
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
    },
    prepare({title, category, subcategory, isCategoryLandingPage}) {
      const subtitle = isCategoryLandingPage
        ? `${category} (Landingsside)`
        : subcategory
        ? `${category} > ${subcategory}`
        : category

      return {
        title: title || 'Ingen tittel',
        subtitle,
      }
    },
  },
})
