import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicComponentProps } from '@entur/utils';

export type Heading1OwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "h1"
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

export type Heading1Props<
  E extends React.ElementType
> = PolymorphicComponentProps<E, Heading1OwnProps>;

const defaultElement = 'h1';

export const Heading1 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  ...rest
}: Heading1Props<E>): JSX.Element => (
  <BaseHeading as={defaultElement} margin={margin} {...rest} level={1}>
    {children}
  </BaseHeading>
);
