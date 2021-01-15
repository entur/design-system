import React from 'react';
import classNames from 'classnames';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

export type StrongTextOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "strong"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer
   * @default "both"
   */
  margin?: 'top' | 'bottom' | 'both' | 'none';
};

export type StrongTextProps<
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithoutRef<StrongTextOwnProps, E>;

const defaultElement = 'strong';

export const StrongText = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  margin = 'both',
  as,
  ...rest
}: StrongTextProps<E>) => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
      className={classNames(
        'eds-strong-text',
        {
          [`eds-strong-text--margin-top`]: margin === 'top',
          [`eds-strong-text--margin-bottom`]: margin === 'bottom',
          [`eds-strong-text--margin-none`]: margin === 'none',
        },
        className,
      )}
      {...rest}
    />
  );
};
