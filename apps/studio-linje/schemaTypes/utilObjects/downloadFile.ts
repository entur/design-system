import {defineField, defineType} from 'sanity'

export const downloadFile = defineType({
  name: 'downloadFile',
  title: 'Nedlastingsfil',
  type: 'object',
  fields: [
    defineField({
      name: 'fileType',
      title: 'Filtype',
      type: 'string',
      options: {
        list: [
          {title: 'Opplastet fil', value: 'uploaded'},
          {title: 'Ekstern lenke', value: 'link'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'uploaded',
    }),
    defineField({
      name: 'uploadedFile',
      title: 'Opplastet fil',
      type: 'file',
      hidden: ({parent}) => parent?.fileType !== 'uploaded',
    }),
    defineField({
      name: 'fileLink',
      title: 'Fil-lenke',
      type: 'url',
      hidden: ({parent}) => parent?.fileType !== 'link',
    }),
    defineField({
      name: 'downloadLabel',
      title: 'Nedlastningstekst (valgfri)',
      type: 'string',
      description: 'Navnet som vil vises for nedlastingen',
    }),
    defineField({
      name: 'fileFormat',
      title: 'Filformat',
      type: 'string',
      description: 'f.eks. PNG, PDF, AI, SVG',
      hidden: ({parent}) => parent?.fileType !== 'link',
    }),
  ],
  preview: {
    select: {
      downloadLabel: 'downloadLabel',
      fileFormat: 'fileFormat',
      fileType: 'fileType',
      uploadedFile: 'uploadedFile.asset.originalFilename',
      fileLink: 'fileLink',
    },
    prepare({downloadLabel, fileFormat, fileType, uploadedFile, fileLink}) {
      let title = downloadLabel || 'Unnamed file'
      let subtitle = `${fileFormat || 'Unknown format'} (${
        fileType === 'uploaded' ? 'Uploaded' : 'Link'
      })`

      // Override title with actual filename or link if no custom label is provided
      if (!downloadLabel) {
        if (fileType === 'uploaded' && uploadedFile) {
          title = uploadedFile
        } else if (fileType === 'link' && fileLink) {
          title = fileLink
        }
      }

      return {
        title,
        subtitle,
      }
    },
  },
})
