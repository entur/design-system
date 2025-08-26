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
  as: string | React.ElementType;
  variant?: TypographyHeadingVariant;
  size?: TypographySize;
  children: React.ReactNode;
  className?: string;
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

  return (
    <HeadingElement
      className={classNames(
        'eds-heading',
        usedVariant && `eds-heading--${usedVariant}`,
        size && `eds-heading--${size}`,
        getSpacingClasses(spacing, 'eds-heading'),
        className,
      )}
      {...rest}
    >
      {children}
    </HeadingElement>
  );
};
