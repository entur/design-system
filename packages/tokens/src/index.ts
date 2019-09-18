/*
  Entur Design Tokens

  Hi there 👋 This file contains all the design tokens used in the Entur 
  design system. It's broken up into a few different sections:

  - colors
  - typography
  - dimensions
  - responsivity

  It's the source of truth of our design system, and any change here should be 
  made in sync with our design team.
*/
export const colors = {
  brand: {
    blue: '#181c56',
    lavender: '#aeb7e2',
    white: '#ffffff',
    coral: '#ff5959',
    peach: '#ffbf9e',
  },
  blues: {
    blue10: '#292b6a',
    blue20: '#393d79',
    blue30: '#54568c',
    blue40: '#656782',
    blue50: '#8285a8',
    blue60: '#babbcf',
    blue70: '#d1d4e3',
    blue80: '#ebebf1',
  },
  greys: {
    grey: '#565659',
    grey10: '#d1d3d3',
    grey20: '#e9e9e9',
    grey30: '#f3f3f3',
    grey40: '#f8f8f8',
  },
  validation: {
    lava: '#d31b1b',
    lavaContrast: '#ff9494',
    lavaTint: '#ffcece',
    mint: '#1a8e60',
    mintContrast: '#5ac39a',
    mintTint: '#d0f1e3', // The best name
    canary: '#efd358',
  },
  misc: {
    focus: '#44c0ff',
    black: '#1a1a1a',
  },
  transport: {
    default: {
      metro: '#de8108',
      bus: '#dd5415',
      plane: '#800664',
      helicopter: '#800664',
      tram: '#78469a',
      funicular: '#642e88',
      cableway: '#642e88',
      taxi: '#181c56',
      bicycle: '#181c56',
      walk: '#181c56',
      train: '#00367f',
      ferry: '#0497bc',
      carferry: '#0497bc',
      mobility: '#388f76',
    },
    contrast: {
      metro: '#f08901',
      bus: '#ff5974',
      plane: '#e258c3',
      helicopter: '#e258c3',
      tram: '#a476e5',
      funicular: '#a476e5',
      cableway: '#a476e5',
      taxi: '#ffffff',
      bicycle: '#ffffff',
      walk: '#ffffff',
      train: '#42a5f5',
      ferry: '#6fdfff',
      carferry: '#6fdfff',
      mobility: '#00db9b',
    },
  },
};

// Dimensions
const spaceScale = [0, 4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96];
export const space = {
  none: spaceScale[0],
  default: spaceScale[3],

  extraSmall: spaceScale[1],
  small: spaceScale[2],
  medium: spaceScale[3],
  large: spaceScale[4],
  extraLarge: spaceScale[5],
  extraLarge2: spaceScale[6],
  extraLarge3: spaceScale[7],
  extraLarge4: spaceScale[8],
  extraLarge5: spaceScale[9],
  extraLarge6: spaceScale[10],
  extraLarge7: spaceScale[11],
  extraLarge8: spaceScale[12],
  extraLarge9: spaceScale[13],
};

// Typography
export const fontWeights = {
  body: '500',
  heading: '600',
};
const fontSizeScale = [10, 12, 14, 16, 22, 28, 34];
export const fontSizes = {
  extraSmall: fontSizeScale[0],
  small: fontSizeScale[1],
  medium: fontSizeScale[2],
  large: fontSizeScale[3],
  extraLarge: fontSizeScale[4],
  extraLarge2: fontSizeScale[5],
  extraLarge3: fontSizeScale[6],
};
const lineHeightScale = [14, 16, 20, 22, 24, 28, 30, 36, 42];
export const lineHeights = {
  extraSmall: lineHeightScale[0],
  small: lineHeightScale[1],
  medium: lineHeightScale[2],
  large: lineHeightScale[3],
  extraLarge: lineHeightScale[4],
  extraLarge2: lineHeightScale[5],
  extraLarge3: lineHeightScale[6],
  extraLarge4: lineHeightScale[7],
  extraLarge5: lineHeightScale[8],
};
// Responsivity
export const breakpoints = {
  large: 800,
};
