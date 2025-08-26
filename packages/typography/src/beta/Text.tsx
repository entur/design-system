import React from 'react';

import './styles.scss';
import classNames from 'classnames';
import {
  TypographySize,
  TypographyTextVariant,
  TypographyWeight,
  TypographySpacing,
} from './types';

export type TextProps = {
  /** HTML-element eller React-komponent som rendres */
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  /** Visuell tekststørrelse (typografi-token) */
  size?: TypographySize;
  /** Fontvekt */
  weight?: TypographyWeight;
  /** Variant (kan brukes til spesielle typer tekst som for eksempel caption) */
  variant?: TypographyTextVariant;
  /** Innhold */
  children: React.ReactNode;
  /** Spacing around the component */
  spacing?: TypographySpacing;
  /** Ekstra klassenavn */
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

const TypographyText = ({
  as: BodyElement = 'span',
  size,
  variant,
  weight = 'medium',
  spacing,
  className,
  children,
  ...rest
}: TextProps) => {
  return (
    <BodyElement
      className={classNames(
        'eds-text',
        variant && `eds-text--${variant}`,
        size && `eds-text--${size}`,
        weight && `eds-text--${weight}`,
        spacing && {
          [`eds-text--spacing-none`]: spacing === 'none',
          [`eds-text--spacing-xs2`]: spacing === 'xs2',
          [`eds-text--spacing-xs2-top`]: spacing === 'xs2-top',
          [`eds-text--spacing-xs2-bottom`]: spacing === 'xs2-bottom',
          [`eds-text--spacing-xs`]: spacing === 'xs',
          [`eds-text--spacing-xs-top`]: spacing === 'xs-top',
          [`eds-text--spacing-xs-bottom`]: spacing === 'xs-bottom',
          [`eds-text--spacing-sm`]: spacing === 'sm',
          [`eds-text--spacing-sm-top`]: spacing === 'sm-top',
          [`eds-text--spacing-sm-bottom`]: spacing === 'sm-bottom',
          [`eds-text--spacing-md`]: spacing === 'md',
          [`eds-text--spacing-md-top`]: spacing === 'md-top',
          [`eds-text--spacing-md-bottom`]: spacing === 'md-bottom',
          [`eds-text--spacing-lg`]: spacing === 'lg',
          [`eds-text--spacing-lg-top`]: spacing === 'lg-top',
          [`eds-text--spacing-lg-bottom`]: spacing === 'lg-bottom',
          [`eds-text--spacing-xl`]: spacing === 'xl',
          [`eds-text--spacing-xl-top`]: spacing === 'xl-top',
          [`eds-text--spacing-xl-bottom`]: spacing === 'xl-bottom',
        },
        className,
      )}
      {...rest}
    >
      {children}
    </BodyElement>
  );
};

// Export as Text to avoid DOM conflicts
export const Text = TypographyText;
