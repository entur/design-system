import {GridViewIcon} from '@entur/icons'
import {defineType, defineField, defineArrayMember} from 'sanity'

export const GroupType = defineType({
  name: 'group',
  type: 'object',
  icon: GridViewIcon,
  fields: [
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'array',
      of: [
        defineArrayMember({type: 'imageAndText'}),
        defineArrayMember({type: 'textBlocks'}),
        defineArrayMember({type: 'link'}),
      ],
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({content}) {
      console.log(content)
      return {
        title: `Gruppe med: ${content.map((content) => content._type + ' ')}`,
      }
    },
  },
})
