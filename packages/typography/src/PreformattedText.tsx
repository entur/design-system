import React from 'react';
import classNames from 'classnames';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

export type PreformattedTextOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "pre"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
};

export type PreformattedTextProps<E extends React.ElementType> =
  PolymorphicPropsWithoutRef<PreformattedTextOwnProps, E>;

const defaultElement = 'pre';

export const PreformattedText = <
  E extends React.ElementType = typeof defaultElement,
>({
  className,
  as,
  ...rest
}: PreformattedTextProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
      className={classNames('eds-preformatted-text', className)}
      {...rest}
    />
  );
};
