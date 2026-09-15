// oxlint-disable-next-line no-warning-comments -- awaiting a ranking from design
/** The data visualisation palette, in the order it should be used.
 *
 * TODO The order below is the old eight-colour ranking with chalk, lime and
 * mystic appended. Replace it once design has ranked the expanded palette.
 */
export const dataHues = [
  'blue',
  'coral',
  'jungle',
  'azure',
  'lavender',
  'peach',
  'spring',
  'lilac',
  'chalk',
  'lime',
  'mystic',
] as const;

export type DataHue = (typeof dataHues)[number];

export const dataTiers = ['standard', 'tint', 'contrast'] as const;

export type DataTier = (typeof dataTiers)[number];

export const dataTierLabels: Record<DataTier, string> = {
  standard: 'Standard',
  tint: 'Tint',
  contrast: 'Contrast',
};

/** The CSS variable holding a hue in a given tier, e.g. `var(--standard-blue)` */
export const dataColorVar = (tier: DataTier, hue: DataHue) =>
  `var(--${tier}-${hue})`;
