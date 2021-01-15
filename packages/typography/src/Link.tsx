import React from 'react';
import classNames from 'classnames';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

export type LinkOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "a"
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

export type LinkProps<
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithoutRef<LinkOwnProps, E>;

const defaultElement = 'a';

export const Link = <E extends React.ElementType = typeof defaultElement>({
  className,
  margin = 'both',
  as,
  ...rest
}: LinkProps<E>) => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
      className={classNames(
        'eds-link',
        {
          [`eds-link--margin-top`]: margin === 'top',
          [`eds-link--margin-bottom`]: margin === 'bottom',
          [`eds-link--margin-none`]: margin === 'none',
        },
        className,
      )}
      {...rest}
    />
  );
};
