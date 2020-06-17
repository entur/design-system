import React from 'react';
import { Button } from './Button';

export type PrimaryButtonProps = {
  /** Størrelsen på knappen
   * @default 'medium'
   */
  size?: 'medium' | 'large';
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Bredden på knappen.
   * @default 'auto'
   */
  width?: 'fluid' | 'auto';
  /** Innholdet i knappen */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager knappen
   * @default 'button'
   */
  as?: 'a' | 'button' | React.ElementType;
  [key: string]: any;
};

export const PrimaryButton = React.forwardRef<
  HTMLButtonElement,
  PrimaryButtonProps
>((props, ref) => <Button {...props} ref={ref} variant="primary" />);
