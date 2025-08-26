import React from 'react';

import classNames from 'classnames';
import {
  TypographyHeadingVariant,
  TypographySize,
  TypographySpacing,
} from './types';
import { getHeadingVariantFromSemanticType, getSpacingClasses } from './utils';
import './styles.scss';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML-element eller React-komponent som rendres (f.eks. 'h1', 'h2', 'h3', etc.) */
  as: string | React.ElementType;
  /** Visuell variant som bestemmer styling (anbefalt over size) */
  variant?: TypographyHeadingVariant;
  /** Visuell tekststørrelse som overstyrer variant-styling */
  size?: TypographySize;
  /** Innholdet som skal vises */
  children: React.ReactNode;
  /** Ekstra klassenavn for tilpasset styling */
  className?: string;
  /** Inline CSS-stiler */
  style?: React.CSSProperties;
  /** Spacing around the component */
  spacing?: TypographySpacing;
}

export const Heading = ({
  children,
  as,
  size,
  variant,
  spacing,
  className,
  ...rest
}: HeadingProps) => {
  const HeadingElement = as || 'h1';

  // Function to determine the variant based on the semantic type
  const usedVariant =
    variant ?? getHeadingVariantFromSemanticType(HeadingElement) ?? 'title-1';

  // When size is explicitly provided, it should override variant styling
  const shouldUseSize = size !== undefined;

  return (
    <HeadingElement
      className={classNames(
        'eds-heading',
        // Only apply variant if size is not specified
        !shouldUseSize && usedVariant && `eds-heading--${usedVariant}`,
        // Size takes precedence when specified
        shouldUseSize && size && `eds-heading--${size}`,
        getSpacingClasses(spacing, 'eds-heading'),
        className,
      )}
      {...rest}
    >
      {children}
    </HeadingElement>
  );
};
