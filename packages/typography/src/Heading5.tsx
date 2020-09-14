import React from 'react';
import { BaseHeading } from './BaseHeading';

export type Heading5Props = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer
   * @default "both"
   */
  margin?: 'top' | 'bottom' | 'both' | 'none';
  [key: string]: any;
};

export const Heading5: React.FC<Heading5Props> = ({
  as = 'h5',
  margin = 'both',
  ...rest
}) => <BaseHeading as={as} margin={margin} {...rest} level={5} />;
