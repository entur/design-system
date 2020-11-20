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
};

export const TertiaryButton = React.forwardRef<
  HTMLButtonElement,
  TertiaryButtonProps
>((props, ref) => <Button {...props} ref={ref} variant="tertiary" />);
