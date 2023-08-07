import {
  DenmarkIcon,
  NorwayIcon,
  SamiIcon,
  PrioritySeatSeniorsIcon,
  SwedenIcon,
  UKIcon,
} from '@entur/icons';

import { fuzzy } from 'fast-fuzzy';

export const dropdownItems = [
  'Voksen',
  'Barn',
  { label: 'Honnør', value: 'honnor', icon: PrioritySeatSeniorsIcon },
  'Militær',
];

export const fuzzyMatch = fuzzy;

export const countries = [
  { label: 'Danmark', value: 'danmark', icons: [DenmarkIcon] },
  { label: 'England', value: 'england', icons: [UKIcon] },
  { label: 'Norge', value: 'norge', icons: [NorwayIcon] },
  { label: 'Sápmi', value: 'sapmi', icons: [SamiIcon] },
  { label: 'Sverige', value: 'sverige', icons: [SwedenIcon] },
];

export const cities = [
  'Oslo',
  'Bergen',
  'Trondheim',
  'Stavanger',
  'kristiansand',
  'kristiansund',
  'Molde',
  'Bodø',
  'Hønefoss',
  'Egersund',
  'Haugesund',
  'Leikanger',
  'Hjerkinn',
  'Steinkjer',
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
