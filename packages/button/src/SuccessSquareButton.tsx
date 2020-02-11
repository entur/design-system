import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';

export type SuccessSquareButtonProps = {
  /** Tekst og ikon, ikon og tekst, eller bare ikon */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const SuccessSquareButton: React.FC<
  SuccessSquareButtonProps
> = props => <BaseSquareButton {...props} variant="success" />;
