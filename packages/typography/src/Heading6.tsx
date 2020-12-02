import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicComponentProps } from '@entur/utils';

export type Heading6OwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "h6"
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

export type Heading6Props<
  E extends React.ElementType
> = PolymorphicComponentProps<E, Heading6OwnProps>;

const defaultElement = 'h6';

export const Heading6 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  ...rest
}: Heading6Props<E>): JSX.Element => (
  <BaseHeading as={defaultElement} margin={margin} {...rest} level={6}>
    {children}
  </BaseHeading>
);
