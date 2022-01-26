import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from '@entur/utils';

export type TertiarySquareButtonBaseProps = {
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

export type TertiarySquareButtonProps<
  E extends React.ElementType = typeof defaultElement,
> = PolymorphicPropsWithRef<TertiarySquareButtonBaseProps, E>;

const defaultElement = 'button';

export const TertiarySquareButton: PolymorphicForwardRefExoticComponent<
  TertiarySquareButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PolymorphicPropsWithoutRef<TertiarySquareButtonBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return (
      <BaseSquareButton as={Element} ref={ref} {...props} variant="tertiary" />
    );
  },
);
