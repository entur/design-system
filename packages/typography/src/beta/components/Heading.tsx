import React from 'react';

import classNames from 'classnames';
import {
  TypographyHeadingVariant,
  TypographySize,
  TypographySpacingProps,
} from '../types';
import {
  getHeadingVariantFromSemanticType,
  getSpacingStyle,
} from '../utils/utils';
import { PolymorphicComponentProps } from '@entur/utils';

import './heading.scss';

export type HeadingOwnProps = TypographySpacingProps & {
  /** Visuell variant som bestemmer styling (anbefalt over size) */
  variant?: TypographyHeadingVariant;
  /** Visuell tekststørrelse som overstyrer variant-styling */
  size?: TypographySize;
  /** Innholdet som skal vises */
  children?: React.ReactNode;
  /** Ekstra klassenavn for tilpasset styling */
  className?: string;
};

export type HeadingProps<C extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<C, HeadingOwnProps>;

export type HeadingComponent = (<
  C extends React.ElementType = typeof defaultElement,
>(
  props: HeadingProps<C> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'h1';

export const Heading = React.forwardRef(
  <C extends React.ElementType = typeof defaultElement>(
    {
      children,
      as,
      size,
      variant,
      spacing,
      style,
      className,
      ...rest
    }: HeadingProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const HeadingElement: React.ElementType = as || defaultElement;

    // Function to determine the variant based on the semantic type
    const usedVariant =
      variant ?? getHeadingVariantFromSemanticType(HeadingElement);

    // When size is explicitly provided, it should override variant styling
    const shouldUseSize = size !== undefined;

    return (
      <HeadingElement
        ref={ref}
        className={classNames(
          'eds-heading',
          // Only apply variant if size is not specified
          { [`eds-heading--${usedVariant}`]: !shouldUseSize },
          // Size takes precedence when specified
          { [`eds-heading--${size}`]: shouldUseSize && size },
          className,
        )}
        style={getSpacingStyle(spacing, style)}
        {...rest}
      >
        {children}
      </HeadingElement>
    );
  },
) as HeadingComponent;
Heading.displayName = 'Heading';
