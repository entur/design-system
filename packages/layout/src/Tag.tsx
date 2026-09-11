import React from 'react';
import classNames from 'classnames';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
  VariantType,
} from '@entur/utils';

import './Tag.scss';

export type TagHue =
  | 'spring'
  | 'jungle'
  | 'blue'
  | 'lilac'
  | 'lavender'
  | 'coral'
  | 'peach'
  | 'lime'
  | 'mystic';

export type TagVariant = 'neutral' | TagHue | VariantType;

export type TagSize = 'small' | 'medium' | 'large';

export type TagOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "span"
   */
  as?: 'span' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet i taggen. Ikoner arver tekstfargen, og legges inn som `children`
   * sammen med teksten */
  children: React.ReactNode;
  /** Fargevarianten til taggen. `neutral` og de ni kategorifargene er nøytrale
   * i betydning, mens `success`, `warning`, `negative` og `information` sier
   * noe om status
   * @default "neutral"
   */
  variant?: TagVariant;
  /** Størrelsen på taggen
   * @default "medium"
   */
  size?: TagSize;
  /** @deprecated Bruk `size="small"` i stedet */
  compact?: boolean;
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
      as,
      className,
      children,
      variant = 'neutral',
      size,
      compact = false,
      ...rest
    }: TagProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || defaultElement;
    const computedSize = size ?? (compact ? 'small' : 'medium');

    return (
      <Element
        className={classNames(
          'eds-tag',
          `eds-tag--variant-${variant}`,
          `eds-tag--size-${computedSize}`,
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
