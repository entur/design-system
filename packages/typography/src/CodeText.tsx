import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';

export type CodeTextOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "code"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
};

export type CodeTextProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, CodeTextOwnProps>;

const defaultElement = 'code';

export const CodeText = <E extends React.ElementType = typeof defaultElement>({
  className,
  as,
  ...rest
}: CodeTextProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element className={classNames('eds-code-text', className)} {...rest} />
  );
};
