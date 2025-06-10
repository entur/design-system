import React from 'react';

import './styles.scss';
import classNames from 'classnames';
import {
  TypographySize,
  TypographyTextVariant,
  TypographyWeight,
  TypographyMargin,
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
  /** Spacingvalg */
  margin?: TypographyMargin;
  /** Ekstra klassenavn */
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

export const Text = ({
  as: BodyElement = 'span',
  size,
  variant,
  weight = 'medium',
  margin = 'both',
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
        {
          [`eds-text--margin-top`]: margin === 'top',
          [`eds-text--margin-bottom`]: margin === 'bottom',
          [`eds-text--margin-none`]: margin === 'none',
        },
        className,
      )}
      {...rest}
    >
      {children}
    </BodyElement>
  );
};
