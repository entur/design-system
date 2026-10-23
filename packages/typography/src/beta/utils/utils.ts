import type { TypographyHeadingVariant } from '../components/Heading';
import type { TypographyTextVariant } from '../components/Text';
import type { TypographySpacing } from '../types';

type SpacingStep = Exclude<TypographySpacing, object>;

// Same scale as the layout beta, read from @entur/tokens/styles/spacing
export const SPACING_STEPS = new Set<string>([
  'none',
  '2xs',
  'xs',
  's',
  'm',
  'lg',
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
  '12xl',
  '13xl',
]);
const warnedSpacing = new Set<string>();

function toSpacingValue(step: SpacingStep | undefined): string | undefined {
  if (step === undefined) return undefined;
  if (SPACING_STEPS.has(step))
    // A unit keeps it valid inside calc()
    return step === 'none' ? '0px' : `var(--spacing-${step})`;

  if (process.env.NODE_ENV !== 'production' && !warnedSpacing.has(step)) {
    warnedSpacing.add(step);
    console.warn(
      `[@entur/typography] spacing="${step}" er ikke en gyldig verdi og blir ignorert. Bruk none, 2xs, xs, s, m, lg, xl, 2xl … 13xl, eller { top, bottom }.`,
    );
  }
  return undefined;
}

/**
 * Turn the spacing prop into the custom properties that set the margins
 */
export function getSpacingStyle(
  spacing: TypographySpacing | undefined,
  style?: React.CSSProperties,
): React.CSSProperties | undefined {
  if (spacing === undefined) return style;

  const { top, bottom } =
    typeof spacing === 'object' ? spacing : { top: spacing, bottom: spacing };
  const spacingStyle: Record<string, string> = {};
  const topValue = toSpacingValue(top);
  const bottomValue = toSpacingValue(bottom);
  if (topValue) spacingStyle['--eds-text-spacing-top'] = topValue;
  if (bottomValue) spacingStyle['--eds-text-spacing-bottom'] = bottomValue;

  return { ...spacingStyle, ...style };
}

/**
 * Pass maxLines on to the CSS, which cuts the text after that many lines
 */
export function getMaxLinesStyle(
  maxLines: number | undefined,
  style?: React.CSSProperties,
): React.CSSProperties | undefined {
  if (!maxLines) return style;
  return { '--eds-text-max-lines': maxLines, ...style } as React.CSSProperties;
}

/**
 * Get heading variant based on semantic HTML element
 */
export function getHeadingVariantFromSemanticType(
  element: string | React.ElementType,
): TypographyHeadingVariant {
  // Same as the default element, h2
  if (typeof element !== 'string') return 'title-2';

  switch (element.toLowerCase()) {
    case 'h1':
      return 'title-1';
    case 'h2':
      return 'title-2';
    case 'h3':
      return 'subtitle-1';
    case 'h4':
      return 'subtitle-2';
    case 'h5':
      return 'section-1';
    case 'h6':
      return 'section-2';
    default:
      return 'title-2';
  }
}

// Elements that hold a paragraph of their own; anything else sits in other text and inherits it
const BLOCK_TEXT_ELEMENTS = new Set([
  'p',
  'div',
  'li',
  'dd',
  'dt',
  'figcaption',
]);

/**
 * The variant Text uses when none is given: paragraph on its own line, inherit inside other text
 */
export function getDefaultTextVariant(
  element: React.ElementType,
): 'paragraph' | 'inherit' {
  return typeof element === 'string' && BLOCK_TEXT_ELEMENTS.has(element)
    ? 'paragraph'
    : 'inherit';
}

/**
 * Get semantic HTML element from text variant
 */
export function getSemanticTypeFromTextVariant(
  variant: TypographyTextVariant | undefined,
): keyof JSX.IntrinsicElements {
  if (!variant) return 'p';

  switch (variant) {
    case 'emphasized':
      return 'em';
    case 'code':
      return 'code';
    case 'preformatted':
      return 'pre';
    case 'quote':
      return 'blockquote';
    case 'leading':
    case 'paragraph':
    case 'subparagraph':
    case 'caption':
    case 'label':
    case 'overline':
    case 'sublabel':
    default:
      return 'p';
  }
}
