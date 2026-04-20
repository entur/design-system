import {
  TypographyHeadingVariant,
  TypographySpacing,
  TypographyTextVariant,
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

/**
 * Get heading variant based on semantic HTML element
 */
export function getHeadingVariantFromSemanticType(
  element: string | React.ElementType,
): TypographyHeadingVariant {
  const elementStr = typeof element === 'string' ? element : element.toString();

  switch (elementStr.toLowerCase()) {
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
): string {
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
