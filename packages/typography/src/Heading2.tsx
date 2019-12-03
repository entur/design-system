import React from 'react';
import { BaseHeading } from './BaseHeading';

export type Heading2Props = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer */
  margin?: 'top' | 'bottom' | 'both' | 'none';
  [key: string]: any;
};

export const Heading2: React.FC<Heading2Props> = ({
  as = 'h2',
  margin = 'both',
  ...rest
}) => <BaseHeading as={as} margin={margin} {...rest} level={2} />;
