import {
  TypographyHeadingVariant,
  TypographySpacing,
  TypographyTextVariant,
  TypographyWeight,
} from '../types';

/**
 * Get spacing classes for a component
 */
export function getSpacingClasses(
  spacing: TypographySpacing | undefined,
  baseClass: string,
): string {
  if (!spacing) return '';

  const spacingMap: Record<string, string> = {
    none: `${baseClass}--spacing-none`,
    xs2: `${baseClass}--spacing-xs2`,
    'xs2-top': `${baseClass}--spacing-xs2-top`,
    'xs2-bottom': `${baseClass}--spacing-xs2-bottom`,
    xs: `${baseClass}--spacing-xs`,
    'xs-top': `${baseClass}--spacing-xs-top`,
    'xs-bottom': `${baseClass}--spacing-xs-bottom`,
    sm: `${baseClass}--spacing-sm`,
    'sm-top': `${baseClass}--spacing-sm-top`,
    'sm-bottom': `${baseClass}--spacing-sm-bottom`,
    md: `${baseClass}--spacing-md`,
    'md-top': `${baseClass}--spacing-md-top`,
    'md-bottom': `${baseClass}--spacing-md-bottom`,
    lg: `${baseClass}--spacing-lg`,
    'lg-top': `${baseClass}--spacing-lg-top`,
    'lg-bottom': `${baseClass}--spacing-lg-bottom`,
    xl: `${baseClass}--spacing-xl`,
    'xl-top': `${baseClass}--spacing-xl-top`,
    'xl-bottom': `${baseClass}--spacing-xl-bottom`,
  };

  return spacingMap[spacing] || '';
}

const deprecatedWeights: Partial<
  Record<TypographyWeight, 'regular' | 'medium' | 'bold'>
> = {
  semibold: 'bold',
  '600': 'bold',
  '500': 'medium',
  '400': 'regular',
  regular: 'regular',
};
const warnedWeights = new Set<string>();

/**
 * Map a weight to its class suffix; deprecated values warn once in development
 */
export function getWeightClassSuffix(
  weight: TypographyWeight | undefined,
): string | undefined {
  if (!weight) return undefined;
  const replacement = deprecatedWeights[weight];
  if (!replacement) return weight;

  if (process.env.NODE_ENV !== 'production' && !warnedWeights.has(weight)) {
    warnedWeights.add(weight);
    const hint =
      replacement === 'regular'
        ? 'Nationale Regular brukes ikke i Linje – bruk "medium" eller "bold".'
        : `Bruk weight="${replacement}" i stedet.`;
    console.warn(`[@entur/typography] weight="${weight}" er utdatert. ${hint}`);
  }
  return replacement;
}

let warnedMargin = false;

/**
 * Warn once in development when the legacy `margin` prop is passed
 */
export function warnAboutLegacyMargin(margin: unknown): void {
  if (
    margin === undefined ||
    warnedMargin ||
    process.env.NODE_ENV === 'production'
  )
    return;
  warnedMargin = true;
  console.warn(
    '[@entur/typography] margin har ingen effekt på ny typografi. Bruk spacing i stedet.',
  );
}

/**
 * Get heading variant based on semantic HTML element
 */
export function getHeadingVariantFromSemanticType(
  element: string | React.ElementType,
): TypographyHeadingVariant {
  if (typeof element !== 'string') return 'title-1';

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
      return 'title-1';
  }
}

/**
 * Get semantic HTML element from text variant
 */
export function getSemanticTypeFromTextVariant(
  variant: TypographyTextVariant | undefined,
): keyof JSX.IntrinsicElements {
  if (!variant) return 'p';

  switch (variant) {
    case 'label':
      return 'label';
    case 'sublabel':
      return 'span';
    case 'caption':
      return 'span';
    case 'overline':
      return 'span';
    case 'link':
      return 'a';
    case 'code-text':
      return 'code';
    case 'preformatted-text':
      return 'pre';
    case 'quote':
      return 'blockquote';
    case 'leading':
    case 'paragraph':
    case 'subparagraph':
    case 'emphasized':
    default:
      return 'p';
  }
}
