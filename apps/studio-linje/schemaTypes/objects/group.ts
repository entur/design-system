import { GridViewIcon } from '@entur/icons';
import { defineType, defineField, defineArrayMember } from 'sanity';

export const GroupType = defineType({
  name: 'group',
  title: 'Gruppe',
  type: 'object',
  icon: GridViewIcon,
  fields: [
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'array',
      of: [
        defineArrayMember({ type: 'media', title: 'Tekst' }),
        defineArrayMember({ type: 'textBlocks' }),
        defineArrayMember({ type: 'link' }),
        defineArrayMember({ type: 'imageAndText' }),
      ],
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      const items = Array.isArray(content) ? content : [];
      const titles = items
        .map((item: any) => {
          switch (item?._type) {
            case 'textBlocks':
              return item?.title || 'Tekstboks';
            case 'link':
              return item?.linkText || 'Lenke';
            case 'imageAndText':
              return item?.guidelineTitle || 'Bilde og tekst';
            case 'media':
              if (item?.mediaType === 'video') return item?.title || 'Video';
              if (item?.mediaType === 'image')
                return item?.imageDescription || 'Bilde';
              return 'Media';
            default:
              return item?._type;
          }
        })
        .filter(Boolean);

      return {
        title: titles.length > 0 ? `Gruppe: ${titles.join(', ')}` : 'Gruppe',
      };
    },
  },
});
