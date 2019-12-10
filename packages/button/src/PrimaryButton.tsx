import React from 'react';
import { Button, ButtonProps } from './Button';

export type PrimaryButtonProps = Omit<ButtonProps, 'variant'>;

export const PrimaryButton: React.RefForwardingComponent<
  HTMLButtonElement,
  PrimaryButtonProps
> = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="primary" />
));
