import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

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

export type Heading5Props<T extends React.ElementType = typeof defaultElement> =
  PolymorphicPropsWithoutRef<Heading5OwnProps, T>;

const defaultElement = 'h5';

export const Heading5 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  as,
  ...rest
}: Heading5Props<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <BaseHeading as={Element} margin={margin} {...rest} level={5}>
      {children}
    </BaseHeading>
  );
};
