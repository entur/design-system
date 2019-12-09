import { BusIcon, SubwayIcon, TramIcon, TrainIcon } from '@entur/icons';

export default [
  'Rikshospitalet',
  'Gaustadalléen',
  {
    value: 'Forskningsparken',
    label: 'Forskningsparken',
    icons: [SubwayIcon, TramIcon],
  },
  'Universitetet Blindern',
  'John Colletts Plass',
  'Ullevål Sykehus',
  'Adamstuen',
  'Stensgata',
  { value: 'Bislett', label: 'Bislett', icons: [TramIcon, BusIcon] },
  'Dalsbergstien',
  'Frydenlund',
  'Holbergsplass',
  'Tullinløkka',
  'Tinghuset',
  'Stortorvet',
  {
    value: 'Jernbanetorget',
    label: 'Jernbanetorget',
    icons: [TramIcon, BusIcon, TrainIcon],
  },
];
