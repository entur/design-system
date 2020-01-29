import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';

export type SecondarySquareButtonProps = {
  /** Tekst og ikon, ikon og tekst, eller bare ikon */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const SecondarySquareButton: React.FC<
  SecondarySquareButtonProps
> = props => <BaseSquareButton {...props} variant="secondary" />;
