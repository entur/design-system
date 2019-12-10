import React from 'react';
import { Button, ButtonProps } from './Button';

export type SecondaryButtonProps = Omit<ButtonProps, 'variant'>;

export const SecondaryButton: React.RefForwardingComponent<
  HTMLButtonElement,
  SecondaryButtonProps
> = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="secondary" />
));
