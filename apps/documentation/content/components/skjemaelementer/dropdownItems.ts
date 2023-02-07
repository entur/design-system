import {
  DenmarkIcon,
  NorwayIcon,
  PrioritySeatSeniorsIcon,
  SwedenIcon,
  UKIcon,
} from '@entur/icons';

export const dropdownItems = [
  'Voksen',
  'Barn',
  { label: 'Honnør', value: 'honnor', icon: PrioritySeatSeniorsIcon },
  'Militær',
];

export const countries = [
  { label: 'Danmark', value: 'danmark', icon: DenmarkIcon },
  { label: 'England', value: 'england', icon: UKIcon },
  { label: 'Norge', value: 'norge', icon: NorwayIcon },
  { label: 'Sverige', value: 'sverige', icon: SwedenIcon },
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
