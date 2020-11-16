export const travelswitch = [
  {
    name: 'size',
    defaultValue: 'medium',
    options: ['medium', 'large'],
    type: 'segmented',
  },
  {
    name: 'children',
    defaultValue: 'Buss',
    type: 'string',
    label: 'Label',
  },
  {
    name: 'transport',
    defaultValue: 'bus',
    options: [
      'bus',
      'metro',
      'air',
      'tram',
      'rail',
      'water',
      'bike',
      'airportLinkBus',
      'airportLinkRail',
      'scooter',
    ],
    type: 'dropdown',
  },
];

export const travelheader = [
  {
    name: 'size',
    defaultValue: 'large',
    options: ['medium', 'large'],
    type: 'segmented',
  },
  {
    name: 'from',
    defaultValue: 'Oslo',
    type: 'string',
    label: 'Fra',
  },
  {
    name: 'to',
    defaultValue: 'Bergen',
    type: 'string',
    label: 'Til',
  },
];

export const travelleg = [
  {
    name: 'direction',
    defaultValue: 'vertical',
    options: ['vertical', 'horizontal'],
    type: 'segmented',
  },
  {
    name: 'transport',
    defaultValue: 'bus',
    options: [
      'bus',
      'metro',
      'air',
      'tram',
      'rail',
      'water',
      'bike',
      'scooter',
      'foot',
      'car',
    ],
    type: 'dropdown',
  },
];

export const traveltag = [];
