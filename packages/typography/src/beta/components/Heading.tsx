import React from 'react';

import classNames from 'classnames';
import { TypographySpacingProps } from '../types';
import {
  getHeadingVariantFromSemanticType,
  getSpacingStyle,
} from '../utils/utils';
import { PolymorphicComponentProps } from '@entur/utils';

import './heading.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type HeadingOwnProps = TypographySpacingProps & {
  /** Visuell variant som bestemmer styling (anbefalt over size) */
  variant?:
    | 'title-1'
    | 'title-2'
    | 'subtitle-1'
    | 'subtitle-2'
    | 'section-1'
    | 'section-2';
  /** Visuell tekststørrelse som overstyrer variant-styling */
  size?: 'xs' | 's' | 'm' | 'lg' | 'xl' | '2xl';
  /** Innholdet som skal vises */
  children?: React.ReactNode;
  /** Fjerner luften over versalhøyden og under grunnlinjen, så teksten flukter med elementer ved siden av. Har ingen effekt i nettlesere uten støtte for `text-box`. */
  trim?: boolean;
  /** Ekstra klassenavn for tilpasset styling */
  className?: string;
};

export type TypographyHeadingVariant = NonNullable<HeadingOwnProps['variant']>;
export type TypographyHeadingSize = NonNullable<HeadingOwnProps['size']>;

export type HeadingProps<C extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<C, HeadingOwnProps>;

export type HeadingComponent = (<
  C extends React.ElementType = typeof defaultElement,
>(
  props: HeadingProps<C> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'h1';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const Heading = React.forwardRef(
  <C extends React.ElementType = typeof defaultElement>(
    {
      children,
      as,
      size,
      variant,
      spacing,
      style,
      trim,
      className,
      ...rest
    }: HeadingProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const HeadingElement: React.ElementType = as || defaultElement;

    const usedVariant =
      variant ?? getHeadingVariantFromSemanticType(HeadingElement);

    return (
      <HeadingElement
        ref={ref}
        className={classNames(
          'eds-heading',
          `eds-heading--${usedVariant}`,
          size && `eds-heading--${size}`,
          trim && 'eds-heading--trim',
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
