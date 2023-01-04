import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';

type TertiarySquareButtonBaseProps = {
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

export type TertiarySquareButtonProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, TertiarySquareButtonBaseProps>;

export type TertiarySquareButtonComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: TertiarySquareButtonProps<T>,
) => React.ReactElement | null;

const defaultElement = 'button';

export const TertiarySquareButton: TertiarySquareButtonComponent =
  React.forwardRef(
    <T extends React.ElementType = typeof defaultElement>(
      props: TertiarySquareButtonProps<T>,
      ref: PolymorphicRef<T>,
    ) => {
      const Element: React.ElementType = props.as || defaultElement;
      return (
        // @ts-expect-error type error due to props not being BaseButtonProps
        <BaseSquareButton
          as={Element}
          ref={ref}
          {...props}
          variant="tertiary"
        />
      );
    },
  );
