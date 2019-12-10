import React from 'react';
import { Button } from './Button';

export type TertiaryButtonProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Innholdet i knappen */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager knappen
   * @default 'button'
   */
  as?: 'a' | 'button' | React.ElementType;
  [key: string]: any;
};

export const TertiaryButton: React.RefForwardingComponent<
  HTMLButtonElement,
  TertiaryButtonProps
> = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="tertiary" />
));
