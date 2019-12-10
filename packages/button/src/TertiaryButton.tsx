import React from 'react';
import { Button, ButtonProps } from './Button';

export type TertiaryButtonProps = Omit<
  ButtonProps,
  'variant' | 'loading' | 'size' | 'width'
>;

export const TertiaryButton: React.RefForwardingComponent<
  HTMLButtonElement,
  TertiaryButtonProps
> = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="tertiary" />
));
