import React from 'react';

import classNames from 'classnames';
import {
  TypographyHeadingVariant,
  TypographySize,
  TypographyMargin,
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
  margin?: TypographyMargin;
}

export const Heading = ({
  children,
  as,
  size,
  variant,
  margin = 'both',
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
        variant && `eds-heading--${usedVariant}`,
        size && `eds-heading--${size}`,
        {
          [`eds-heading--margin-top`]: margin === 'top',
          [`eds-heading--margin-bottom`]: margin === 'bottom',
          [`eds-heading--margin-none`]: margin === 'none',
        },
        className,
      )}
      {...rest}
    >
      {children}
    </HeadingElement>
  );
};
