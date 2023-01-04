import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';

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

export type SuccessSquareButtonProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, SuccessSquareButtonBaseProps>;

export type SuccessSquareButtonComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: SuccessSquareButtonProps<T>,
) => React.ReactElement | null;

const defaultElement = 'button';

export const SuccessSquareButton: SuccessSquareButtonComponent =
  React.forwardRef(
    <T extends React.ElementType = typeof defaultElement>(
      props: SuccessSquareButtonProps<T>,
      ref: PolymorphicRef<T>,
    ) => {
      const Element: React.ElementType = props.as || defaultElement;
      return (
        // @ts-expect-error type error due to props not being BaseButtonProps
        <BaseSquareButton as={Element} ref={ref} {...props} variant="success" />
      );
    },
  );
