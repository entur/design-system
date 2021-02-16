import React from 'react';
import { Button } from './Button';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
  PolymorphicForwardRefExoticComponent,
} from '@entur/utils';

export type NegativeButtonBaseProps = {
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
  as?: 'button' | React.ElementType;
};

export type NegativeButtonProps<
  T extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<NegativeButtonBaseProps, T>;

const defaultElement = 'button';

export const NegativeButton: PolymorphicForwardRefExoticComponent<
  NegativeButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PolymorphicPropsWithoutRef<NegativeButtonBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return <Button as={Element} {...props} ref={ref} variant="negative" />;
  },
);
