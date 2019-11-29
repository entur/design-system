import React from 'react';
import { BaseHeading } from './BaseHeading';

export type Heading4Props = {
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

export const Heading4: React.FC<Heading4Props> = ({
  as = 'h4',
  margin = 'both',
  ...rest
}) => <BaseHeading as={as} margin="both" {...rest} level={4} />;
