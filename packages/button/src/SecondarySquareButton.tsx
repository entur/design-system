import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';

export type SecondarySquareButtonProps = {
  /** Tekst og ikon, ikon og tekst, eller bare ikon */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
  /** HTML-elementet eller React-komponenten som lager knappen
   * @default 'button'
   */
  as?: 'a' | 'button' | React.ElementType;
  [key: string]: any;
};

export const SecondarySquareButton = React.forwardRef<
  HTMLButtonElement,
  SecondarySquareButtonProps
>((props, ref: React.Ref<HTMLButtonElement>) => (
  <BaseSquareButton ref={ref} {...props} variant="secondary" />
));
