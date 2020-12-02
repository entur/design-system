import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';

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

export type CodeTextProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, CodeTextOwnProps>;

const defaultElement = 'code';

export const CodeText = <E extends React.ElementType = typeof defaultElement>({
  className,
  ...rest
}: CodeTextProps<E>): JSX.Element => (
  <Box
    as={defaultElement}
    className={classNames('eds-code-text', className)}
    {...rest}
  />
);
