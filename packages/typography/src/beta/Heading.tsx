import React from 'react';

import classNames from 'classnames';
import {
  TypographyHeadingVariant,
  TypographySize,
  TypographySpacing,
} from './types';
import { getHeadingVariantFromSemanticType } from './utils';
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
        spacing && {
          [`eds-heading--spacing-none`]: spacing === 'none',
          [`eds-heading--spacing-xs2`]: spacing === 'xs2',
          [`eds-heading--spacing-xs2-top`]: spacing === 'xs2-top',
          [`eds-heading--spacing-xs2-bottom`]: spacing === 'xs2-bottom',
          [`eds-heading--spacing-xs`]: spacing === 'xs',
          [`eds-heading--spacing-xs-top`]: spacing === 'xs-top',
          [`eds-heading--spacing-xs-bottom`]: spacing === 'xs-bottom',
          [`eds-heading--spacing-sm`]: spacing === 'sm',
          [`eds-heading--spacing-sm-top`]: spacing === 'sm-top',
          [`eds-heading--spacing-sm-bottom`]: spacing === 'sm-bottom',
          [`eds-heading--spacing-md`]: spacing === 'md',
          [`eds-heading--spacing-md-top`]: spacing === 'md-top',
          [`eds-heading--spacing-md-bottom`]: spacing === 'md-bottom',
          [`eds-heading--spacing-lg`]: spacing === 'lg',
          [`eds-heading--spacing-lg-top`]: spacing === 'lg-top',
          [`eds-heading--spacing-lg-bottom`]: spacing === 'lg-bottom',
          [`eds-heading--spacing-xl`]: spacing === 'xl',
          [`eds-heading--spacing-xl-top`]: spacing === 'xl-top',
          [`eds-heading--spacing-xl-bottom`]: spacing === 'xl-bottom',
        },
        className,
      )}
      {...rest}
    >
      {children}
    </HeadingElement>
  );
};
