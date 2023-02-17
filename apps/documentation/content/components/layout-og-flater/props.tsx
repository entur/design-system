import { AdvancedProps } from '../../../src/components/playground/AdvancedPlayground';
export const cards: AdvancedProps = [
  {
    name: 'title',
    type: 'string',
    defaultValue: 'Reiseplanleggeren',
    label: 'Tittel',
  },
  {
    name: 'titleIcon',
    type: 'icon',
    label: 'Ikon',
    defaultValue: 'AdjustmentsIcon',
    options: ['AdjustmentsIcon', 'BellIcon', 'DestinationIcon'],
  },
  {
    name: 'href',
    type: 'string',
    defaultValue: 'https://om.entur.no/reisende/reiseplanleggeren/',
    label: 'Link',
  },
  {
    name: 'children',
    type: 'string',
    defaultValue:
      'Les mer om hele Norges reiseplanlegger, som du kan ha tilgjengelig rett i lomma',
    label: 'Innhold',
  },
  {
    name: 'compact',
    type: 'boolean',
    defaultValue: false,
    label: 'Kompakt',
  },
  {
    name: 'externalLink',
    type: 'boolean',
    defaultValue: false,
    label: 'Ekstern lenke',
  },
];
