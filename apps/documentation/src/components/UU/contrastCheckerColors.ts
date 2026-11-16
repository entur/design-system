import { base, colors, data, semantic } from '@entur/tokens';
import { flatten } from '../../utils/flatten';

export type ContrastColor = {
  label: string;
  /** The CSS variable name in the label, if any */
  cssName?: string;
  hex: string;
  /** The variable names a developer can copy, by format */
  formats: (
    resolveName: (name: string) => string,
  ) => Array<[format: string, variable: string]>;
};

/**
 * The JS keys drop a dash before digits that some CSS names keep
 * (contrastalt-2, but transparentalt2), so ask the page which one exists.
 */
export const resolveCssName = (name: string) => {
  if (typeof document === 'undefined') return name;
  const style = getComputedStyle(document.documentElement);
  const withoutDash = name.replace(/-(\d)/g, '$1');
  if (
    !style.getPropertyValue(`--${name}`) &&
    style.getPropertyValue(`--${withoutDash}`)
  )
    return withoutDash;
  return name;
};

// frame.contrastalt2 -> frame-contrastalt-2, as in the generated CSS
const toKebab = (path: string) =>
  path
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-z])(\d)/g, '$1-$2')
    .toLowerCase();

// Contrast cannot be calculated for transparent colours
const isOpaque = (hex: string) => /^#[0-9a-f]{6}$/i.test(hex);

const modes = [
  ['light', ''],
  ['dark', 'mørk'],
] as const;

const withSuffix = (name: string, ...suffixes: string[]) => {
  const suffix = suffixes.filter(Boolean).join(', ');
  return suffix ? `${name} (${suffix})` : name;
};

const baseColors = modes.flatMap(([mode, modeName]) =>
  Object.entries(flatten(base[mode].baseColors)).map(([path, hex]) => {
    const name = `basecolors-${toKebab(path)}`;
    return {
      label: withSuffix(name, modeName),
      cssName: name,
      hex,
      formats: resolve => [['CSS', `var(--${resolve(name)})`]],
    } as ContrastColor;
  }),
);

const semanticColors = Object.entries(flatten(semantic)).map(([path, hex]) => {
  const name = toKebab(path);
  return {
    label: name,
    cssName: name,
    hex,
    formats: resolve => [
      ['CSS', `var(--${resolve(name)})`],
      ['SCSS', `$${resolve(name)}`],
      ['LESS', `@${resolve(name)}`],
    ],
  } as ContrastColor;
});

const dataColors = modes.flatMap(([mode, modeName]) =>
  Object.entries(flatten(data[mode])).map(([path, hex]) => {
    const name = toKebab(path);
    return {
      label: withSuffix(name, 'data', modeName),
      cssName: name,
      hex,
      formats: resolve => [['CSS', `var(--${resolve(name)})`]],
    } as ContrastColor;
  }),
);

const legacyColors = Object.entries(flatten(colors)).map(
  ([path, hex]) =>
    ({
      label: withSuffix(path, 'legacy'),
      hex,
      formats: () => [
        ['LESS', `@colors.${path}`],
        ['SCSS', `$colors.${path}`],
      ],
    } as ContrastColor),
);

/** Base first, then semantic, data and the legacy colours */
export const contrastColors: ContrastColor[] = [
  ...baseColors,
  ...semanticColors,
  ...dataColors,
  ...legacyColors,
].filter(color => isOpaque(color.hex));
