import React from 'react';

import classNames from 'classnames';

import { PolymorphicComponentProps } from '@entur/utils';

import {
  getDefaultTextVariant,
  getSemanticTypeFromTextVariant,
  getSpacingStyle,
} from '../utils/utils';

import { TypographySpacingProps } from '../types';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type TextOwnProps = TypographySpacingProps & {
  /** Visuell tekststørrelse (typografi-token) */
  size?: 'xs' | 's' | 'm' | 'lg' | 'xl';
  /** Fontvekt: `medium` (500) eller `bold` (600) */
  weight?: 'medium' | 'bold';
  /** Variant (kan brukes til spesielle typer tekst som for eksempel caption).
   * Uten variant blir teksten `paragraph` når den står for seg selv (`p`, `div`, `li` …), og arver
   * størrelse, farge og vekt når den står inne i annen tekst (`span`, `strong`, en komponent …). */
  variant?:
    | 'leading'
    | 'quote'
    | 'paragraph'
    | 'subparagraph'
    | 'caption'
    | 'label'
    | 'sublabel'
    | 'overline'
    | 'emphasized'
    | 'code'
    | 'preformatted';
  /** Innhold */
  children?: React.ReactNode;
  /** Fjerner luften over versalhøyden og under grunnlinjen, så teksten flukter med elementer ved siden av. Har ingen effekt i nettlesere uten støtte for `text-box`. */
  trim?: boolean;
  /** Ekstra klassenavn */
  className?: string;
};

export type TypographyTextVariant = NonNullable<TextOwnProps['variant']>;
export type TypographyTextSize = NonNullable<TextOwnProps['size']>;
export type TypographyWeight = NonNullable<TextOwnProps['weight']>;

export type TextProps<C extends React.ElementType = 'p'> =
  PolymorphicComponentProps<C, TextOwnProps>;

export type TextComponent = (<C extends React.ElementType = 'p'>(
  props: TextProps<C> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const Text = React.forwardRef(
  <C extends React.ElementType = 'p'>(
    {
      children,
      as,
      size,
      variant,
      weight,
      spacing,
      style,
      trim,
      className,
      ...rest
    }: TextProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const BodyElement: React.ElementType =
      as || getSemanticTypeFromTextVariant(variant);
    const usedVariant = variant ?? getDefaultTextVariant(BodyElement);

    return (
      <BodyElement
        ref={ref}
        className={classNames(
          'eds-text',
          `eds-text--${usedVariant}`,
          size && `eds-text--${size}`,
          weight && `eds-text--weight-${weight}`,
          trim && 'eds-text--trim',
          className,
        )}
        style={getSpacingStyle(spacing, style)}
        {...rest}
      >
        {children}
      </BodyElement>
    );
  },
) as TextComponent;
Text.displayName = 'Text';
