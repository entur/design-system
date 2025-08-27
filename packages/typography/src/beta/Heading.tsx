import React from 'react';

import classNames from 'classnames';
import {
  TypographyHeadingVariant,
  TypographySize,
  TypographySpacing,
} from './types';
import { getHeadingVariantFromSemanticType, getSpacingClasses } from './utils';
import { PolymorphicComponentProps } from '@entur/utils';
import './styles.scss';

type HeadingBaseProps = {
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
};

export type HeadingProps<C extends React.ElementType> =
  PolymorphicComponentProps<C, HeadingBaseProps>;

export const Heading = <C extends React.ElementType = 'h1'>({
  children,
  as,
  size,
  variant,
  spacing,
  className,
  ...rest
}: HeadingProps<C>) => {
  const HeadingElement = as || 'h1';

  // Function to determine the variant based on the semantic type
  const usedVariant =
    variant ?? getHeadingVariantFromSemanticType(HeadingElement);

  // When size is explicitly provided, it should override variant styling
  const shouldUseSize = size !== undefined;

  return (
    <HeadingElement
      className={classNames(
        'eds-heading',
        // Only apply variant if size is not specified
        { [`eds-heading--${usedVariant}`]: !shouldUseSize },
        // Size takes precedence when specified
        { [`eds-heading--${size}`]: shouldUseSize && size },
        getSpacingClasses(spacing, 'eds-heading'),
        className,
      )}
      {...rest}
    >
      {children}
    </HeadingElement>
  );
};
