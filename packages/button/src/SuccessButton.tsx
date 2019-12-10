import React from 'react';
import { Button, ButtonProps } from './Button';

export type SuccessButtonProps = Omit<ButtonProps, 'variant'>;

export const SuccessButton: React.RefForwardingComponent<
  HTMLButtonElement,
  SuccessButtonProps
> = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="success" />
));
