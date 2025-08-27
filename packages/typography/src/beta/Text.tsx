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
import { PolymorphicComponentProps } from '@entur/utils';

type TextBaseProps = {
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
};

export type TextProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  TextBaseProps
>;

const TypographyText = <C extends React.ElementType = 'p'>({
  children,
  as,
  size,
  variant,
  weight = 'medium',
  spacing,
  className,
  ...rest
}: TextProps<C>) => {
  const BodyElement = as || 'p';

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
