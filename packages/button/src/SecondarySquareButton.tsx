import React from 'react';
import { BaseSquareButton } from './BaseSquareButton';
import { PolymorphicComponentProps } from '@entur/utils';

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

export type SecondarySquareButtonProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, SecondarySquareButtonBaseProps>;

const defaultElement = 'button';

export const SecondarySquareButton: <E extends React.ElementType = typeof defaultElement>(
  props: SecondarySquareButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    props: SecondarySquareButtonProps<E>,
    ref: typeof props.ref,
  ) => (
    <BaseSquareButton
      as={defaultElement}
      ref={ref}
      {...props}
      variant="secondary"
    />
  ),
);
