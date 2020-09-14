import React from 'react';
import { BaseHeading } from './BaseHeading';

export type Heading3Props = {
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

export const Heading3: React.FC<Heading3Props> = ({
  as = 'h3',
  margin = 'both',
  ...rest
}) => <BaseHeading as={as} margin={margin} {...rest} level={3} />;
