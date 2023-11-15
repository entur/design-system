import React from 'react';
import { SquareButton } from './SquareButton';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';

type SecondarySquareButtonBaseProps = {
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

export type SecondarySquareButtonProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, SecondarySquareButtonBaseProps>;

export type SecondarySquareButtonComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: SecondarySquareButtonProps<T>,
) => React.ReactElement | null;

const defaultElement = 'button';

export const SecondarySquareButton: SecondarySquareButtonComponent =
  React.forwardRef(
    <T extends React.ElementType = typeof defaultElement>(
      props: SecondarySquareButtonProps<T>,
      ref: PolymorphicRef<T>,
    ) => {
      const Element: React.ElementType = props.as || defaultElement;
      return (
        // @ts-expect-error type error due to props not being BaseButtonProps
        <SquareButton as={Element} ref={ref} {...props} variant="secondary" />
      );
    },
  );
