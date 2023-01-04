import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicComponentProps } from '@entur/utils';

export type Heading2OwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "h2"
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

export type Heading2Props<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, Heading2OwnProps>;

const defaultElement = 'h2';

export const Heading2 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  as,
  ...rest
}: Heading2Props<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <BaseHeading as={Element} margin={margin} {...rest} level={2}>
      {children}
    </BaseHeading>
  );
};
