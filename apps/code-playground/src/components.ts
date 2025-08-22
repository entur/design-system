export { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import './index.scss';
export * from '@entur/a11y';
export * from '@entur/alert';
export * from '@entur/button';
export * from '@entur/chip';
export * from '@entur/datepicker';
export * from '@entur/dropdown';
export * from '@entur/expand';
export * from '@entur/fileupload';
export * from '@entur/form';
export * from '@entur/grid';
export * from '@entur/icons';
export * from '@entur/layout';
export * from '@entur/loader';
export * from '@entur/menu';
export * from '@entur/modal';
export * from '@entur/tab';
export * from '@entur/table';
export * from '@entur/tokens';
export * from '@entur/tooltip';
export * from '@entur/travel';
export * from '@entur/typography';

export { TestBench } from './TestBench';

// Exports to make code examples from linje.entur.no work

export {
  now,
  today,
  isWeekday,
  isWeekend,
  isToday,
  parseAbsolute,
  isSameDay,
} from '@internationalized/date';
export {
  nativeDateToDateValue,
  nativeDateToTimeValue,
  timeOrDateValueToNativeDate,
} from '@entur/datepicker';

import {
  PrioritySeatSeniorsIcon,
  DenmarkIcon,
  UKIcon,
  NorwayIcon,
  SamiIcon,
  SwedenIcon,
} from '@entur/icons';

export const dropdownItems = [
  'Voksen',
  'Barn',
  { label: 'Honnør', value: 'honnor', icons: [PrioritySeatSeniorsIcon] },
  'Militær',
];

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
  'Kristiansand',
  'Kristiansund',
  'Molde',
  'Bodø',
  'Hønefoss',
  'Egersund',
  'Haugesund',
  'Leikanger',
  'Hjerkinn',
  'Steinkjer',
  'Sandefjord',
  'Lillesand',
  'Røros',
  'Ålesund',
  'Førde',
  'Hammerfest',
  'Narvik',
];
