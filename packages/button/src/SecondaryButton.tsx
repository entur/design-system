import React from 'react';
import { Button } from './Button';

export type SecondaryButtonProps = {
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
  /** Bredden på knappen. Defaulter til "standard-størrelse" */
  width?: 'fluid' | 'square';
  /** Innholdet i knappen */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager knappen
   * @default 'button'
   */
  as?: 'a' | 'button' | React.ElementType;
  [key: string]: any;
};

export const SecondaryButton: React.RefForwardingComponent<
  HTMLButtonElement,
  SecondaryButtonProps
> = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="secondary" />
));
