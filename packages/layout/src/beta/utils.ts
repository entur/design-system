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

export type SpacingValue = (typeof VALID_SPACING_VALUES)[number];

/**
 * Value that can vary across breakpoints: base (0px+), s (600px+), m (800px+), lg (1200px+), xl (1400px+).
 *
 * Pass a flat value to apply it at all breakpoints, or an object with `base` (required) and
 * any optional overrides. Omitted breakpoints inherit from the previous one.
 *
 * @example
 * // Same for all breakpoints:
 * direction="column"
 *
 * // column on mobile, row from m upward:
 * direction={{ base: 'column', m: 'row' }}
 *
 * // column on mobile, row from s (600px) upward:
 * direction={{ base: 'column', s: 'row' }}
 */
export type ResponsiveValue<T> =
  | T
  | {
      base: T;
      s?: T;
      m?: T;
      lg?: T;
      xl?: T;
    };

export const isResponsiveObject = <T>(
  value: ResponsiveValue<T>,
): value is { base: T; m?: T; lg?: T; xl?: T } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'base' in value
  );
};

/**
 * Converts a `ResponsiveValue` into CSS custom property entries.
 * Only emits vars for breakpoints that were explicitly set; the SCSS cascade handles
 * inheritance (e.g. -m falls back to -base if unset).
 */
const VALID_BREAKPOINTS = ['base', 's', 'm', 'lg', 'xl'] as const;

export const toResponsiveCssVars = <T>(
  prefix: string,
  value: ResponsiveValue<T> | undefined,
  transform: (v: T) => string | number | undefined = v => v as string | number,
): Record<string, string | number | undefined> => {
  if (value === undefined) return {};

  if (isResponsiveObject(value)) {
    if (process.env.NODE_ENV !== 'production') {
      const unknown = Object.keys(value).filter(
        k =>
          !VALID_BREAKPOINTS.includes(k as (typeof VALID_BREAKPOINTS)[number]),
      );
      if (unknown.length > 0) {
        console.warn(
          `Unknown responsive breakpoint keys: ${unknown
            .map(k => `"${k}"`)
            .join(', ')}. ` +
            `Valid keys are: ${VALID_BREAKPOINTS.join(
              ', ',
            )}. Unknown keys will be ignored.`,
        );
      }
    }

    return {
      [`${prefix}-base`]: transform(value.base),
      ...(value.s !== undefined && { [`${prefix}-s`]: transform(value.s) }),
      ...(value.m !== undefined && { [`${prefix}-m`]: transform(value.m) }),
      ...(value.lg !== undefined && { [`${prefix}-lg`]: transform(value.lg) }),
      ...(value.xl !== undefined && { [`${prefix}-xl`]: transform(value.xl) }),
    };
  }

  if (typeof value === 'object' && value !== null) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `Responsive object is missing required "base" key. ` +
          `Got keys: ${Object.keys(value)
            .map(k => `"${k}"`)
            .join(', ')}. ` +
          `Valid keys are: ${VALID_BREAKPOINTS.join(
            ', ',
          )}. Value will be ignored.`,
      );
    }
    return {};
  }

  return { [`${prefix}-base`]: transform(value as T) };
};

const isValidSpacingValue = (value: unknown): value is SpacingValue => {
  return (
    typeof value === 'string' &&
    VALID_SPACING_VALUES.includes(value as SpacingValue)
  );
};

export const getSpacingValue = (
  spacing: SpacingValue | undefined,
  componentName = 'Layout',
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
