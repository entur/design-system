import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

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

export type Heading4Props<T extends React.ElementType = typeof defaultElement> =
  PolymorphicPropsWithoutRef<Heading4OwnProps, T>;

const defaultElement = 'h4';
export const Heading4 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  as,
  ...rest
}: Heading4Props<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <BaseHeading as={Element} margin={margin} {...rest} level={4}>
      {children}
    </BaseHeading>
  );
};
