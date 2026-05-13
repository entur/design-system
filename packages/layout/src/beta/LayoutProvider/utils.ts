const VALID_SPACING_VALUES = [
  '2xs',
  'xs',
  's',
  's-m',
  'm',
  'm-l',
  'l',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  '10xl',
  '11xl',
  'none',
] as const;

export type GridSpacingValue = (typeof VALID_SPACING_VALUES)[number];

export type ResponsiveValue<T> =
  | T
  | {
      s?: T;
      m?: T;
      lg?: T;
      xl?: T;
    };

/**
 * Configurable min-width breakpoints (in px).
 *
 * `s` is always 0 and is not configurable — it is the base (mobile-first)
 * fallback that activates below `m`.
 *
 * - `m`: activates at this width and above (default: 800px)
 * - `lg`: activates at this width and above (default: 1200px)
 * - `xl`: activates at this width and above (default: 1400px)
 */
export type Breakpoints = {
  m: number;
  lg: number;
  xl: number;
};

export const DEFAULT_BREAKPOINTS: Breakpoints = {
  m: 800,
  lg: 1200,
  xl: 1400,
};

const isValidSpacingValue = (value: unknown): value is GridSpacingValue => {
  return (
    typeof value === 'string' &&
    VALID_SPACING_VALUES.includes(value as GridSpacingValue)
  );
};

export const getSpacingValue = (
  spacing: GridSpacingValue | undefined,
  componentName = 'Grid',
): string | undefined => {
  if (!spacing) return undefined;
  if (spacing === 'none') return '0';

  if (!isValidSpacingValue(spacing)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `Invalid ${componentName} spacing value: "${spacing}". Valid values are: ${VALID_SPACING_VALUES.join(
          ', ',
        )}. Falling back to undefined.`,
      );
    }
    return undefined;
  }

  return `var(--${spacing})`;
};
