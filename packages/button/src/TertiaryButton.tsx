import React from 'react';
import { Button } from './Button';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
  PolymorphicForwardRefExoticComponent,
} from '@entur/utils';

export type TertiaryButtonBaseProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Innholdet i knappen */
  children: React.ReactNode;
};

export type TertiaryButtonProps<
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<TertiaryButtonBaseProps, E>;

const defaultElement = 'button';

export const TertiaryButton: PolymorphicForwardRefExoticComponent<
  TertiaryButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PolymorphicPropsWithoutRef<TertiaryButtonBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return <Button as={Element} {...props} ref={ref} variant="tertiary" />;
  },
);
