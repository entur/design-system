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
      sm?: T;
      md?: T;
      lg?: T;
    };

export type Breakpoints = {
  sm: number;
  md: number;
  lg: number;
};

export const DEFAULT_BREAKPOINTS: Breakpoints = {
  sm: 0,
  md: 800,
  lg: 1200,
};

const isValidSpacingValue = (value: unknown): value is GridSpacingValue => {
  return (
    typeof value === 'string' &&
    VALID_SPACING_VALUES.includes(value as GridSpacingValue)
  );
};

export const getSpacingValue = (
  spacing: GridSpacingValue | undefined,
): string | undefined => {
  if (!spacing || spacing === 'none') return undefined;

  if (!isValidSpacingValue(spacing)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `Invalid Grid spacing value: "${spacing}". Valid values are: ${VALID_SPACING_VALUES.join(
          ', ',
        )}. Falling back to undefined.`,
      );
    }
    return undefined;
  }

  return `var(--${spacing})`;
};
