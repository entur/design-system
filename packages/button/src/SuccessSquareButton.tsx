import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
  PolymorphicPropsWithoutRef,
} from '@entur/utils';

type SuccessSquareButtonBaseProps = {
  /** Tekst og ikon, ikon og tekst, eller bare ikon */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
};

export type SuccessSquareButtonProps<
  E extends React.ElementType = typeof defaultElement,
> = PolymorphicPropsWithRef<SuccessSquareButtonBaseProps, E>;

const defaultElement = 'button';

export const SuccessSquareButton: PolymorphicForwardRefExoticComponent<
  SuccessSquareButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PolymorphicPropsWithoutRef<SuccessSquareButtonBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return (
      <BaseSquareButton as={Element} ref={ref} {...props} variant="success" />
    );
  },
);
