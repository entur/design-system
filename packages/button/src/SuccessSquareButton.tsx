import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';
import { PolymorphicComponentProps } from '@entur/utils';

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
  E extends React.ElementType
> = PolymorphicComponentProps<E, SuccessSquareButtonBaseProps>;

const defaultElement = 'button';

export const SuccessSquareButton: <E extends React.ElementType = typeof defaultElement>(
  props: SuccessSquareButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    props: SuccessSquareButtonProps<E>,
    ref: typeof props.ref,
  ) => (
    <BaseSquareButton
      as={defaultElement}
      ref={ref}
      {...props}
      variant="success"
    />
  ),
);
