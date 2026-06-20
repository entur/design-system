import React from 'react';
import classNames from 'classnames';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
  VariantType,
} from '@entur/utils';
import './Tag.scss';

export type TagOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default 'span'
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /**
   * Innhold i Tag. Ved ikoner som children: dekorative ikoner skal ha `aria-hidden`
   * så skjermleseren ikke leser dem som «image». Ikoner som bærer meningen alene
   * trenger `aria-label`. Eksempel: `<CheckIcon aria-hidden /> Godkjent` eller
   * `<WarningIcon aria-label="Advarsel" />`.
   */
  children: React.ReactNode;
  /**
   * Visuell farge-variant
   * @default 'neutral'
   */
  variant?: 'primary' | 'neutral' | VariantType;
  /** Størrelse
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /** Skjul tag */
  hide?: boolean;
};

export type TagProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, TagOwnProps>;

export type TagComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: TagProps<T>,
) => React.ReactElement | null;

const defaultElement = 'span';

export const Tag: TagComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      variant = 'neutral',
      size = 'medium',
      hide = false,
      as,
      ...rest
    }: TagProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || defaultElement;

    return (
      <Element
        className={classNames(
          'eds-tag',
          `eds-tag--variant-${variant}`,
          `eds-tag--size-${size}`,
          { 'eds-tag--hide': hide },
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);
