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
import hexRgb from 'hex-rgb';
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
    blue90: '#F5F5F8',
  },
  greys: {
    grey: '#949494',
    grey10: '#d1d3d3',
    grey20: '#e9e9e9',
    grey30: '#f3f3f3',
    grey40: '#f8f8f8',
  },
  validation: {
    sky: '#0082b9',
    skyContrast: '#64b3e7',
    skyTint: '#e1eff8',
    lava: '#d31b1b',
    lavaContrast: '#ff9494',
    lavaTint: '#ffcece',
    mint: '#1a8e60',
    mintContrast: '#5ac39a',
    mintTint: '#d0f1e3', // The best name
    canary: '#efd358',
  },
  misc: {
    focus: 'rgba(68, 192, 255, 0.5)',
    black: '#1a1a1a',
  },
  transport: {
    default: {
      metro: '#de8108',
      bus: '#c5044e',
      plane: '#800664',
      helicopter: '#800664',
      tram: '#642e88',
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
      bus: '#eb1053',
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

const grey10Rgb = hexRgb(colors.greys.grey10, { format: 'array' })
  .toString()
  .slice(0, -2);
const blue20Rgb = hexRgb(colors.blues.blue20, { format: 'array' })
  .toString()
  .slice(0, -2);
const whiteRgb = hexRgb(colors.brand.white, { format: 'array' })
  .toString()
  .slice(0, -2);
export const shadows = {
  focus: `0 0 0 0.25rem ${colors.misc.focus}`,
  focusContrast: `0 0 0 0.25rem rgba(${whiteRgb}, 0.3)`,
  cardShadow: `0 0.125rem 0.1875rem 0 rgba(${grey10Rgb}, 0.7)`,
  cardShadowHover: `0 0.125rem 1rem 0 rgba(${grey10Rgb}, 0.7)`,
  cardShadowContrast: `0 0.125rem 0.1875rem 0 rgba(${blue20Rgb}, 0.7)`,
  cardShadowHoverContrast: `0 0.125rem 1rem 0 rgba(${blue20Rgb}, 0.7)`,
};

// Dimensions
const spaceScale = [0, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96];
export const space = {
  none: spaceScale[0],
  default: spaceScale[4],

  extraSmall2: spaceScale[1],
  extraSmall: spaceScale[2],
  small: spaceScale[3],
  medium: spaceScale[4],
  large: spaceScale[5],
  extraLarge: spaceScale[6],
  extraLarge2: spaceScale[7],
  extraLarge3: spaceScale[8],
  extraLarge4: spaceScale[9],
  extraLarge5: spaceScale[10],
  extraLarge6: spaceScale[11],
  extraLarge7: spaceScale[12],
  extraLarge8: spaceScale[13],
  extraLarge9: spaceScale[14],
};

// Typography
export const fontWeights = {
  body: '500',
  heading: '600',
};
const fontSizeScale = [10, 12, 14, 16, 24, 28, 32, 40];
export const fontSizes = {
  extraSmall: fontSizeScale[0],
  small: fontSizeScale[1],
  medium: fontSizeScale[2],
  large: fontSizeScale[3],
  extraLarge: fontSizeScale[4],
  extraLarge2: fontSizeScale[5],
  extraLarge3: fontSizeScale[6],
  extraLarge4: fontSizeScale[7],
};
const lineHeightScale = [14, 16, 20, 22, 24, 28, 30, 36, 42, 48, 60];
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
  extraLarge6: lineHeightScale[9],
  extraLarge7: lineHeightScale[10],
};

// Responsivity
export const breakpoints = {
  large: 800,
  extraLarge: 1200,
};

// Borders
const borderWidthScale = [1, 2, 4];
export const borderWidths = {
  default: borderWidthScale[1],

  small: borderWidthScale[0],
  medium: borderWidthScale[1],
  large: borderWidthScale[2],
};

const borderRadiusScale = [1, 4];
export const borderRadiuses = {
  default: borderRadiusScale[0],

  small: borderRadiusScale[0],
  medium: borderRadiusScale[1],
};

// Z-indexes
const zIndexScale = ['-1', '0', '10', '20', '30', '40', '50'];
export const zIndexes = {
  behind: zIndexScale[0],
  default: zIndexScale[1],
  sticky: zIndexScale[2],
  popover: zIndexScale[3],
  overlay: zIndexScale[4],
  modal: zIndexScale[5],
  toast: zIndexScale[6],
};

const timingScale = ['0.1s', '0.2s', '0.5s'];
export const timings = {
  fast: timingScale[0],
  medium: timingScale[1],
  slow: timingScale[2],
};
