import React from 'react';

import './styles.scss';
import classNames from 'classnames';
import {
  TypographySize,
  TypographyTextVariant,
  TypographyWeight,
  TypographySpacing,
} from './types';
import { getSpacingClasses } from './utils';

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
        getSpacingClasses(spacing, 'eds-text'),
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
