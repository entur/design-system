import React from 'react';
import { Button } from './Button';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
} from '@entur/utils';

type SuccessButtonBaseProps = {
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
  /** Bredden på knappen
   * @default 'auto'
   */
  width?: 'fluid' | 'auto';
  /** Innholdet i knappen */
  children: React.ReactNode;
};

export type SuccessButtonProps<
  E extends React.ElementType = typeof defaultElement,
> = PolymorphicPropsWithRef<SuccessButtonBaseProps, E>;

const defaultElement = 'button';

export const SuccessButton: PolymorphicForwardRefExoticComponent<
  SuccessButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PolymorphicPropsWithoutRef<SuccessButtonBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return <Button as={Element} {...props} ref={ref} variant="success" />;
  },
);
