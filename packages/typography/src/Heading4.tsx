import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicComponentProps } from '@entur/utils';

export type Heading4OwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "h4"
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

export type Heading4Props<
  E extends React.ElementType
> = PolymorphicComponentProps<E, Heading4OwnProps>;

const defaultElement = 'h1';

export const Heading4 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  ...rest
}: Heading4Props<E>): JSX.Element => (
  <BaseHeading as={defaultElement} margin={margin} {...rest} level={4}>
    {children}
  </BaseHeading>
);
