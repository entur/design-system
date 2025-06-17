import {defineField, defineType} from 'sanity'
import * as icons from '@entur/icons'
import IconInput from '../../components/IconInput'

export const inlineIcon = defineType({
  name: 'inlineIcon',
  title: 'Ikon i tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'iconName',
      title: 'Ikon',
      type: 'string',
      options: {
        list: Object.keys(icons).map((icon) => ({
          title: icon,
          value: icon,
        })),
      },
      components: {
        input: IconInput,
      },
    }),
    defineField({
      name: 'iconDescription',
      title: 'Hva symboliserer ikonet?',
      type: 'string',
      hidden: ({parent}) => parent?.hideFromScreenreaders,
    }),
    defineField({
      name: 'hideFromScreenreaders',
      title: 'Skjul for skjermlesere',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
