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

export const FILTERS = [
  { value: 'bus', label: 'Buss' },
  { value: 'tram', label: 'Trikk' },
  { value: 'rail', label: 'Tog' },
  { value: 'metro', label: 'T-bane' },
  { value: 'water', label: 'Ferge' },
  { value: 'air', label: 'Fly' },
  { value: 'flytog', label: 'Flytog' },
  {
    value: 'flybuss',
    label: 'Flybuss',
  },
];
