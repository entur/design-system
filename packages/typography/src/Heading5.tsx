import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicComponentProps } from '@entur/utils';

export type Heading5OwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "h5"
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

export type Heading5Props<
  E extends React.ElementType
> = PolymorphicComponentProps<E, Heading5OwnProps>;

const defaultElement = 'h1';

export const Heading5 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  ...rest
}: Heading5Props<E>): JSX.Element => (
  <BaseHeading as={defaultElement} margin={margin} {...rest} level={5}>
    {children}
  </BaseHeading>
);
