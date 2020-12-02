import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';

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

export type PreformattedTextProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, PreformattedTextOwnProps>;

const defaultElement = 'pre';

export const PreformattedText = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  ...rest
}: PreformattedTextProps<E>): JSX.Element => (
  <Box
    as={defaultElement}
    className={classNames('eds-preformatted-text', className)}
    {...rest}
  />
);
