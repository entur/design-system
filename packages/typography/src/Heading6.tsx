import React from 'react';
import { BaseHeading } from './BaseHeading';

export type Heading6Props = {
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

export const Heading6: React.FC<Heading6Props> = ({
  as = 'h6',
  margin = 'both',
  ...rest
}) => <BaseHeading as={as} margin="both" {...rest} level={6} />;
