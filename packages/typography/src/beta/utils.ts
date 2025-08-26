import { TypographySpacing } from './types';

export function getHeadingVariantFromSemanticType(
  semanticType: string | React.ElementType,
) {
  if (typeof semanticType !== 'string') return undefined;
  switch (semanticType) {
    case 'h1':
      return 'title-1';
    case 'h2':
      return 'title-2';
    case 'h3':
      return 'subtitle-1';
    case 'h4':
      return 'subtitle-2';
    case 'p':
      return 'paragraph';
    default:
      return undefined;
  }
}

/**
 * Generates spacing class names for typography components
 * @param spacing - The spacing value from TypographySpacing
 * @param componentPrefix - The CSS class prefix (e.g., 'eds-heading', 'eds-text')
 * @returns Object with class names for the spacing prop
 */
export function getSpacingClasses(
  spacing: TypographySpacing | undefined,
  componentPrefix: string,
): Record<string, boolean> | undefined {
  if (!spacing) return undefined;

  return {
    [`${componentPrefix}--spacing-none`]: spacing === 'none',
    [`${componentPrefix}--spacing-xs2`]: spacing === 'xs2',
    [`${componentPrefix}--spacing-xs2-top`]: spacing === 'xs2-top',
    [`${componentPrefix}--spacing-xs2-bottom`]: spacing === 'xs2-bottom',
    [`${componentPrefix}--spacing-xs`]: spacing === 'xs',
    [`${componentPrefix}--spacing-xs-top`]: spacing === 'xs-top',
    [`${componentPrefix}--spacing-xs-bottom`]: spacing === 'xs-bottom',
    [`${componentPrefix}--spacing-sm`]: spacing === 'sm',
    [`${componentPrefix}--spacing-sm-top`]: spacing === 'sm-top',
    [`${componentPrefix}--spacing-sm-bottom`]: spacing === 'sm-bottom',
    [`${componentPrefix}--spacing-md`]: spacing === 'md',
    [`${componentPrefix}--spacing-md-top`]: spacing === 'md-top',
    [`${componentPrefix}--spacing-md-bottom`]: spacing === 'md-bottom',
    [`${componentPrefix}--spacing-lg`]: spacing === 'lg',
    [`${componentPrefix}--spacing-lg-top`]: spacing === 'lg-top',
    [`${componentPrefix}--spacing-lg-bottom`]: spacing === 'lg-bottom',
    [`${componentPrefix}--spacing-xl`]: spacing === 'xl',
    [`${componentPrefix}--spacing-xl-top`]: spacing === 'xl-top',
    [`${componentPrefix}--spacing-xl-bottom`]: spacing === 'xl-bottom',
  };
}
