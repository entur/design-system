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

const pxToRem = (pxValue: number) => pxValue / 16;

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
    blue45: '#7C7F9F',
    blue50: '#8285a8',
    blue60: '#babbcf',
    blue70: '#d1d4e3',
    blue80: '#ebebf1',
    blue90: '#f5f5f8',
  },
  greys: {
    grey: '#121212',
    grey10: '#2a2a2a',
    grey20: '#353535',
    grey30: '#4d4d4d',
    grey40: '#646464',
    grey45: '#808080',
    grey50: '#949494',
    grey60: '#d1d3d3',
    grey70: '#e9e9e9',
    grey80: '#f3f3f3',
    grey90: '#f8f8f8',
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
    canary: '#ffca28',
    canaryContrast: '#ffe082',
    canaryTint: '#fff4cd',
  },
  misc: {
    focus: 'rgba(68, 192, 255, 0.5)',
    black: '#000000',
  },
  transport: {
    default: {
      metro: '#bf5826',
      bus: '#c5044e',
      plane: '#800664',
      helicopter: '#800664',
      tram: '#642e88',
      funicular: '#642e88',
      cableway: '#642e88',
      taxi: '#3d3e40',
      bicycle: '#181c56',
      walk: '#8d8e9c',
      train: '#00367f',
      ferry: '#0c6693',
      carferry: '#0c6693',
      mobility: '#388f76',
    },
    contrast: {
      metro: '#f08901',
      bus: '#ff6392',
      plane: '#fbafea',
      helicopter: '#e258c3',
      tram: '#b482fb',
      funicular: '#a476e5',
      cableway: '#a476e5',
      taxi: '#ffe082',
      bicycle: '#ffffff',
      walk: '#8284ab',
      train: '#42a5f5',
      ferry: '#6fdfff',
      carferry: '#6fdfff',
      mobility: '#00db9b',
    },
  },
  data: {
    default: {
      blue: '#181c56',
      coral: '#ff5959',
      jungle: '#0ea2a8',
      azure: '#2f98fa',
      lavender: '#8692ca',
      peach: '#ca825b',
      spring: '#57a257',
      lilac: '#8e57e3',
    },
    contrast: {
      blue: '#6C6EB7',
      coral: '#ff5959',
      jungle: '#0fc2b3',
      azure: '#64b2fb',
      lavender: '#aeb7e2',
      peach: '#ffbf9e',
      spring: '#7bc00b',
      lilac: '#ea8bea',
    },
  },
};

const blackRgb = hexRgb(colors.misc.black, { format: 'array' })
  .toString()
  .slice(0, -2);
const blue20Rgb = hexRgb(colors.blues.blue20, { format: 'array' })
  .toString()
  .slice(0, -2);

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

  rem: {
    none: pxToRem(spaceScale[0]),
    default: pxToRem(spaceScale[4]),

    extraSmall2: pxToRem(spaceScale[1]),
    extraSmall: pxToRem(spaceScale[2]),
    small: pxToRem(spaceScale[3]),
    medium: pxToRem(spaceScale[4]),
    large: pxToRem(spaceScale[5]),
    extraLarge: pxToRem(spaceScale[6]),
    extraLarge2: pxToRem(spaceScale[7]),
    extraLarge3: pxToRem(spaceScale[8]),
    extraLarge4: pxToRem(spaceScale[9]),
    extraLarge5: pxToRem(spaceScale[10]),
    extraLarge6: pxToRem(spaceScale[11]),
    extraLarge7: pxToRem(spaceScale[12]),
    extraLarge8: pxToRem(spaceScale[13]),
    extraLarge9: pxToRem(spaceScale[14]),
  },
};

// Typography
export const fontWeights = {
  body: '500',
  heading: '600',
};
const fontSizeScale = [10, 12, 14, 16, 20, 24, 28, 32, 40];
export const fontSizes = {
  extraSmall: fontSizeScale[0],
  small: fontSizeScale[1],
  medium: fontSizeScale[2],
  large: fontSizeScale[3],
  extraLarge: fontSizeScale[4],
  extraLarge2: fontSizeScale[5],
  extraLarge3: fontSizeScale[6],
  extraLarge4: fontSizeScale[7],
  extraLarge5: fontSizeScale[8],

  rem: {
    extraSmall: pxToRem(fontSizeScale[0]),
    small: pxToRem(fontSizeScale[1]),
    medium: pxToRem(fontSizeScale[2]),
    large: pxToRem(fontSizeScale[3]),
    extraLarge: pxToRem(fontSizeScale[4]),
    extraLarge2: pxToRem(fontSizeScale[5]),
    extraLarge3: pxToRem(fontSizeScale[6]),
    extraLarge4: pxToRem(fontSizeScale[7]),
    extraLarge5: pxToRem(fontSizeScale[8]),
  },
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

  rem: {
    extraSmall: pxToRem(lineHeightScale[0]),
    small: pxToRem(lineHeightScale[1]),
    medium: pxToRem(lineHeightScale[2]),
    large: pxToRem(lineHeightScale[3]),
    extraLarge: pxToRem(lineHeightScale[4]),
    extraLarge2: pxToRem(lineHeightScale[5]),
    extraLarge3: pxToRem(lineHeightScale[6]),
    extraLarge4: pxToRem(lineHeightScale[7]),
    extraLarge5: pxToRem(lineHeightScale[8]),
    extraLarge6: pxToRem(lineHeightScale[9]),
    extraLarge7: pxToRem(lineHeightScale[10]),
  },
};

// Responsivity
export const breakpoints = {
  large: 800,
  extraLarge: 1200,
  rem: {
    large: pxToRem(800),
    extraLarge: pxToRem(1200),
  },
};

// Borders
const borderWidthScale = [1, 2, 4];
export const borderWidths = {
  default: borderWidthScale[1],

  small: borderWidthScale[0],
  medium: borderWidthScale[1],
  large: borderWidthScale[2],

  rem: {
    default: pxToRem(borderWidthScale[1]),

    small: pxToRem(borderWidthScale[0]),
    medium: pxToRem(borderWidthScale[1]),
    large: pxToRem(borderWidthScale[2]),
  },
};

const borderRadiusScale = [1, 4, 8];
export const borderRadiuses = {
  default: borderRadiusScale[0],

  small: borderRadiusScale[0],
  medium: borderRadiusScale[1],
  large: borderRadiusScale[2],

  rem: {
    default: pxToRem(borderRadiusScale[0]),

    small: pxToRem(borderRadiusScale[0]),
    medium: pxToRem(borderRadiusScale[1]),
    large: pxToRem(borderRadiusScale[2]),
  },
};

export const shadows = {
  focus: `0 0 0 0.125rem ${colors.brand.white}, 0 0 0 0.25rem ${colors.brand.blue}`,
  focusContrast: `0 0 0 0.125rem ${colors.brand.blue}, 0 0 0 0.25rem ${colors.brand.white}`,
  cardShadow: `0 0.0625rem 0.1875rem 0 rgba(${blackRgb}, 0.12)`,
  cardShadowHover: `0 0.125rem 1rem 0 rgba(${blackRgb}, 0.1)`,
  cardShadowContrast: `0 0.0625rem 0.1875rem 0 rgba(${blue20Rgb}, 1)`,
  cardShadowHoverContrast: `0 0.125rem 1rem 0 rgba(${blue20Rgb}, 1)`,
  boxShadow: `0 0.0625rem 0.1875rem rgba(${blackRgb}, 0.25)`,
  boxShadowContrast: `0 0.0625rem 0.1875rem rgba(${blue20Rgb}, 1)`,
};

// Z-indexes
const zIndexScale = [-1, 0, 10, 20, 30, 40, 50];
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

export const outlines = {
  focus: `${2}px solid ${colors.brand.blue}`,
  focusContrast: `${2}px solid ${colors.brand.white} `,
};

const outlineOffsetsConstants = [2];
export const outlineOffsets = {
  focus: outlineOffsetsConstants[0],

  rem: {
    focus: pxToRem(outlineOffsetsConstants[0]),
  },
};
