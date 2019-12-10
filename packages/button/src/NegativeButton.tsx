import React from 'react';
import { Button, ButtonProps } from './Button';

export type NegativeButtonProps = Omit<ButtonProps, 'variant'>;

export const NegativeButton: React.RefForwardingComponent<
  HTMLButtonElement,
  NegativeButtonProps
> = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="negative" />
));
