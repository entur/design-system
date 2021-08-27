import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

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

const defaultElement = 'h1';

export type Heading1Props<T extends React.ElementType = typeof defaultElement> =
  PolymorphicPropsWithoutRef<Heading1OwnProps, T>;

export const Heading1 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  as,
  ...rest
}: Heading1Props<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <BaseHeading as={Element} margin={margin} {...rest} level={1}>
      {children}
    </BaseHeading>
  );
};
