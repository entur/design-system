import React from 'react';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { SquareButton } from './SquareButton';

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
  /** DOM-elementet knappen rendres som */
  as?: string | React.ElementType;
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
      // @ts-expect-error TS error seems to stem from how the props are built up
    ) => <SquareButton ref={ref} {...props} variant="tertiary" />,
  );
