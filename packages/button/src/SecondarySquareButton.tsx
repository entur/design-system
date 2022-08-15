import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from '@entur/utils';

export type SecondarySquareButtonBaseProps = {
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

export type SecondarySquareButtonProps<
  E extends React.ElementType = typeof defaultElement,
> = PolymorphicPropsWithRef<SecondarySquareButtonBaseProps, E>;

const defaultElement = 'button';

export const SecondarySquareButton: PolymorphicForwardRefExoticComponent<
  SecondarySquareButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PolymorphicPropsWithoutRef<SecondarySquareButtonBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return (
      <BaseSquareButton as={Element} ref={ref} {...props} variant="secondary" />
    );
  },
);
