import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';

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

export type PreformattedTextProps<T extends React.ElementType> =
  PolymorphicComponentProps<T, PreformattedTextOwnProps>;

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
