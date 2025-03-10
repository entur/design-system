import React from 'react';
import { BaseHeading } from './BaseHeading';
import { PolymorphicComponentProps } from '@entur/utils';

export type Heading3OwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "h3"
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

export type Heading3Props<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, Heading3OwnProps>;

const defaultElement = 'h3';

export const Heading3 = <E extends React.ElementType = typeof defaultElement>({
  margin = 'both',
  children,
  as,
  ...rest
}: Heading3Props<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <BaseHeading as={Element} margin={margin} {...rest} level={3}>
      {children}
    </BaseHeading>
  );
};
